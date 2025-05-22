import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { StreamableHTTPServerTransport } from "./streamableHttpNextjs";
import OpenAI from "openai";
import { Anthropic } from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

// Define the expected JSON-RPC request body type
interface JsonRpcRequest {
  jsonrpc: "2.0";
  method: string;
  params?: any;
  id?: number | string | null;
}

// Initialize LLM clients
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");

// Map to store transports by session ID
const transports: Record<string, StreamableHTTPServerTransport> = {};

export async function POST(req: NextRequest) {
  try {
    console.log("POST handler invoked");
    const acceptHeader = req.headers.get("accept");
    console.log("Received headers:", Object.fromEntries(req.headers.entries()));

    // Validate Accept header
    if (
      !acceptHeader ||
      !(
        acceptHeader.includes("application/json") &&
        acceptHeader.includes("text/event-stream")
      )
    ) {
      console.error("Invalid Accept header:", acceptHeader);
      return NextResponse.json(
        {
          jsonrpc: "2.0",
          error: {
            code: -32000,
            message:
              "Not Acceptable: Client must accept both application/json and text/event-stream",
          },
          id: null,
        },
        { status: 406 }
      );
    }

    const sessionId = req.headers.get("mcp-session-id");
    const body: JsonRpcRequest = await req.json();
    console.log("Received sessionId:", sessionId);
    console.log("Request body:", body);

    let transport: StreamableHTTPServerTransport;

    if (sessionId && transports[sessionId]) {
      console.log("Reusing transport for sessionId:", sessionId);
      transport = transports[sessionId];
    } else if (!sessionId && isInitializeRequest(body)) {
      console.log("Creating new transport for initialization request");
      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => {
          const id = crypto.randomUUID();
          console.log("Generated sessionId:", id);
          return id;
        },
        onsessioninitialized: (id) => {
          console.log("Session initialized with ID:", id);
          transports[id] = transport;
          transport.sessionId = id;
          console.log("New transport created with sessionId:", transport.sessionId);
        },
      });

      // Clean up transport when closed
      transport.onclose = () => {
        if (transport.sessionId) {
          console.log("Cleaning up transport for sessionId:", transport.sessionId);
          delete transports[transport.sessionId];
        }
      };

      // Create and set up the MCP server
      const server = new McpServer({
        name: "LLM-Gateway",
        version: "1.0.0",
      });

      // Add chatGPT tool
      server.tool(
        "chatGPT",
        {
          prompt: z.string(),
          model: z.string().default("gpt-4o"),
          temperature: z.number().min(0).max(2).default(0.7),
        },
        async ({ prompt, model, temperature }) => {
          try {
            const response = await openai.chat.completions.create({
              model,
              messages: [{ role: "user", content: prompt }],
              temperature,
            });
            return {
              content: [
                {
                  type: "text",
                  text: response.choices[0]?.message.content || "No response",
                },
              ],
            };
          } catch (error: any) {
            console.error("Error in chatGPT tool:", error);
            return {
              content: [{ type: "text", text: `Error: ${error.message}` }],
              isError: true,
            };
          }
        }
      );

      // Add Claude tool
      server.tool(
        "claude",
        {
          prompt: z.string(),
          model: z.string().default("claude-3-opus-20240229"),
          temperature: z.number().min(0).max(1).default(0.7),
        },
        async ({ prompt, model, temperature }) => {
          try {
            const response = await anthropic.messages.create({
              model,
              messages: [{ role: "user", content: prompt }],
              temperature,
              max_tokens: 4000,
            });

            let responseText = "No response";
            if (response.content && response.content.length > 0) {
              const firstBlock = response.content[0];
              if (firstBlock.type === "text") {
                responseText = firstBlock.text;
              }
            }

            return {
              content: [
                {
                  type: "text",
                  text: responseText,
                },
              ],
            };
          } catch (error: any) {
            console.error("Error in claude tool:", error);
            return {
              content: [{ type: "text", text: `Error: ${error.message}` }],
              isError: true,
            };
          }
        }
      );

      // Add Gemini tool
      server.tool(
        "gemini",
        {
          prompt: z.string(),
          model: z.string().default("gemini-1.5-pro"),
          temperature: z.number().min(0).max(1).default(0.7),
        },
        async ({ prompt, model, temperature }) => {
          try {
            const geminiModel = genAI.getGenerativeModel({ model });
            const response = await geminiModel.generateContent({
              contents: [{ role: "user", parts: [{ text: prompt }] }],
              generationConfig: { temperature },
            });

            return {
              content: [
                {
                  type: "text",
                  text: response.response.text() || "No response",
                },
              ],
            };
          } catch (error: any) {
            console.error("Error in gemini tool:", error);
            return {
              content: [{ type: "text", text: `Error: ${error.message}` }],
              isError: true,
            };
          }
        }
      );

      // Add system info resource
      server.resource("system-info", "system://info", async (uri) => ({
        contents: [
          {
            uri: uri.href,
            text: `LLM Gateway System - Available models:
- OpenAI: gpt-4o, gpt-4o-mini, gpt-3.5-turbo
- Anthropic: claude-3-opus-20240229, claude-3-sonnet-20240229, claude-3-haiku-20240307
- Google: gemini-1.5-pro, gemini-1.5-flash`,
          },
        ],
      }));

      console.log("Connecting server to transport...");
      await server.connect(transport);
      console.log("Server connected successfully");
    } else {
      console.log("Invalid request: No valid session ID provided");
      return NextResponse.json(
        {
          jsonrpc: "2.0",
          error: {
            code: -32000,
            message: "Bad Request: No valid session ID provided",
          },
          id: body.id ?? null,
        },
        { status: 400 }
      );
    }

    console.log("Handling request with transport...");
    const {
      status,
      headers,
      body: responseBody,
    } = await transport.handleRequestNextjs(req, body);
    console.log("Transport response:", { status, headers, responseBody });

    return new NextResponse(responseBody, {
      status,
      headers,
    });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json(
      {
        jsonrpc: "2.0",
        error: {
          code: -32603,
          message: `Internal Server Error: ${(error as Error).message}`,
        },
        id: null,
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    console.log("GET handler invoked");
    const acceptHeader = req.headers.get("accept");
    console.log("Received headers:", Object.fromEntries(req.headers.entries()));

    if (
      !acceptHeader ||
      !(
        acceptHeader.includes("application/json") &&
        acceptHeader.includes("text/event-stream")
      )
    ) {
      console.error("Invalid Accept header:", acceptHeader);
      return NextResponse.json(
        {
          jsonrpc: "2.0",
          error: {
            code: -32000,
            message:
              "Not Acceptable: Client must accept both application/json and text/event-stream",
          },
          id: null,
        },
        { status: 406 }
      );
    }

    const sessionId = req.headers.get("mcp-session-id");
    console.log("Received sessionId:", sessionId);

    if (!sessionId || !transports[sessionId]) {
      console.log("Invalid or missing session ID");
      return NextResponse.json(
        {
          jsonrpc: "2.0",
          error: {
            code: -32000,
            message: "Invalid or missing session ID",
          },
          id: null,
        },
        { status: 400 }
      );
    }

    const transport = transports[sessionId];
    console.log("Handling GET request with transport...");
    const { status, headers, body } = await transport.handleRequestNextjs(req);
    console.log("Transport response:", { status, headers, body });

    return new NextResponse(body, {
      status,
      headers,
    });
  } catch (error) {
    console.error("Error in GET handler:", error);
    return NextResponse.json(
      {
        jsonrpc: "2.0",
        error: {
          code: -32603,
          message: `Internal Server Error: ${(error as Error).message}`,
        },
        id: null,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    console.log("DELETE handler invoked");
    const acceptHeader = req.headers.get("accept");
    console.log("Received headers:", Object.fromEntries(req.headers.entries()));

    if (
      !acceptHeader ||
      !(
        acceptHeader.includes("application/json") &&
        acceptHeader.includes("text/event-stream")
      )
    ) {
      console.error("Invalid Accept header:", acceptHeader);
      return NextResponse.json(
        {
          jsonrpc: "2.0",
          error: {
            code: -32000,
            message:
              "Not Acceptable: Client must accept both application/json and text/event-stream",
          },
          id: null,
        },
        { status: 406 }
      );
    }

    const sessionId = req.headers.get("mcp-session-id");
    console.log("Received sessionId:", sessionId);

    if (!sessionId || !transports[sessionId]) {
      console.log("Invalid or missing session ID");
      return NextResponse.json(
        {
          jsonrpc: "2.0",
          error: {
            code: -32000,
            message: "Invalid or missing session ID",
          },
          id: null,
        },
        { status: 400 }
      );
    }

    const transport = transports[sessionId];
    console.log("Handling DELETE request with transport...");
    const { status, headers, body } = await transport.handleRequestNextjs(req);
    console.log("Transport response:", { status, headers, body });

    return new NextResponse(body, {
      status,
      headers,
    });
  } catch (error) {
    console.error("Error in DELETE handler:", error);
    return NextResponse.json(
      {
        jsonrpc: "2.0",
        error: {
          code: -32603,
          message: `Internal Server Error: ${(error as Error).message}`,
        },
        id: null,
      },
      { status: 500 }
    );
  }
}

export const config = {
  runtime: "nodejs",
};