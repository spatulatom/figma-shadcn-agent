// streamableHttpNextjs.ts
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { NextRequest } from "next/server";

declare module "@modelcontextprotocol/sdk/server/streamableHttp.js" {
  interface StreamableHTTPServerTransport {
    handleRequestNextjs(
      req: NextRequest,
      body?: any
    ): Promise<{
      status: number;
      headers: Record<string, string>;
      body: string | ReadableStream;
    }>;
  }
}

StreamableHTTPServerTransport.prototype.handleRequestNextjs = async function (
  req: NextRequest,
  body?: any
): Promise<{ status: number; headers: Record<string, string>; body: string | ReadableStream }> {
  console.log("handleRequestNextjs called with method:", req.method);
  console.log("Request headers:", Object.fromEntries(req.headers.entries()));
  console.log("Request body:", body);

  const method = req.method;
  let responseStatus = 200;
  let responseHeaders: Record<string, string> = {};
  let responseBody: string | ReadableStream = "";

  const res = {
    status: (status: number) => {
      console.log("Setting response status:", status);
      responseStatus = status;
      return res;
    },
    setHeader: (name: string, value: string) => {
      console.log(`Setting header: ${name}=${value}`);
      responseHeaders[name] = value;
      return res;
    },
    getHeader: (name: string) => {
      const value = req.headers.get(name) || (name === "accept" ? "application/json, text/event-stream" : undefined);
      console.log(`Getting header: ${name}=${value}`);
      return value;
    },
    write: (chunk: string) => {
      console.log("Writing chunk:", chunk);
      if (typeof responseBody === "string") {
        responseBody += chunk;
      }
      return true;
    },
    end: (data?: string) => {
      console.log("Ending response with data:", data);
      if (data && typeof responseBody === "string") {
        responseBody += data;
      }
      return res;
    },
    headersSent: false,
    writeHead: (status: number, headers?: Record<string, string>) => {
      console.log("Writing head:", { status, headers });
      responseStatus = status;
      if (headers) {
        responseHeaders = { ...responseHeaders, ...headers };
      }
      return res;
    },
    getHeaderNames: () => {
      const names = Array.from(req.headers.keys());
      console.log("Header names:", names);
      return names;
    },
  };

  try {
    if (method === "POST" && body) {
      console.log("Handling POST request with body:", body);
      await this.handleRequest(req as any, res as any, body);
    } else {
      console.log("Handling non-POST request");
      await this.handleRequest(req as any, res as any);
    }
  } catch (error) {
    console.error("Error in handleRequestNextjs:", error);
    responseStatus = 500;
    responseBody = JSON.stringify({
      jsonrpc: "2.0",
      error: {
        code: -32603,
        message: `Transport error: ${(error as Error).message}`,
      },
      id: body?.id ?? null,
    });
  }

  console.log("Returning transport response:", { status: responseStatus, headers: responseHeaders, body: responseBody });
  return {
    status: responseStatus,
    headers: responseHeaders,
    body: responseBody,
  };
};

export { StreamableHTTPServerTransport };