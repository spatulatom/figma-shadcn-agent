import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { StreamableHTTPServerTransport } from "./streamableHttpNextjs";
import OpenAI from "openai";
import { Anthropic } from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

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

// Handle POST requests
export async function POST(req: NextRequest) {
  const sessionId = req.headers.get("mcp-session-id");
  const body = await req.json();

  let transport: StreamableHTTPServerTransport;

  if (sessionId && transports[sessionId]) {
    // Reuse existing transport
    transport = transports[sessionId];
  } else if (!sessionId && isInitializeRequest(body)) {
    // Create a new server for this session
    transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => crypto.randomUUID(),
      onsessioninitialized: (id) => {
        transports[id] = transport;
      },
    });

    // Clean up transport when closed
    transport.onclose = () => {
      if (transport.sessionId) {
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

          // Extract text safely from the response
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
          return {
            content: [{ type: "text", text: `Error: ${error.message}` }],
            isError: true,
          };
        }
      }
    );

    // Add a system info resource
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

    // Connect the server to the transport
    await server.connect(transport);
  } else {
    // Invalid request
    return NextResponse.json(
      {
        jsonrpc: "2.0",
        error: {
          code: -32000,
          message: "Bad Request: No valid session ID provided",
        },
        id: null,
      },
      { status: 400 }
    );
  }

  // Handle the request with the appropriate transport
  const {
    status,
    headers,
    body: responseBody,
  } = await transport.handleRequestNextjs(req, body);

  return new NextResponse(responseBody, {
    status,
    headers,
  });
}

// Handle GET requests for server-to-client notifications via SSE
export async function GET(req: NextRequest) {
  const sessionId = req.headers.get("mcp-session-id");

  if (!sessionId || !transports[sessionId]) {
    return NextResponse.json(
      {
        error: "Invalid or missing session ID",
      },
      { status: 400 }
    );
  }

  const transport = transports[sessionId];
  const { status, headers, body } = await transport.handleRequestNextjs(req);

  return new NextResponse(body, {
    status,
    headers,
  });
}

// Handle DELETE requests for session termination
export async function DELETE(req: NextRequest) {
  const sessionId = req.headers.get("mcp-session-id");

  if (!sessionId || !transports[sessionId]) {
    return NextResponse.json(
      {
        error: "Invalid or missing session ID",
      },
      { status: 400 }
    );
  }

  const transport = transports[sessionId];
  const { status, headers, body } = await transport.handleRequestNextjs(req);

  return new NextResponse(body, {
    status,
    headers,
  });
}
