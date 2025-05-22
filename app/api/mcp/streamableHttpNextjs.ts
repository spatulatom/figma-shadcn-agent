import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { NextRequest } from "next/server";

// Extend the StreamableHTTPServerTransport class to add Next.js support
declare module "@modelcontextprotocol/sdk/server/streamableHttp.js" {
  interface StreamableHTTPServerTransport {
    handleRequestNextjs(
      req: NextRequest,
      body?: any
    ): Promise<{
      status: number;
      headers: Record<string, string>;
      body: string;
    }>;
  }
}

// Add a method to handle Next.js requests
StreamableHTTPServerTransport.prototype.handleRequestNextjs = async function (
  req: NextRequest,
  body?: any
): Promise<{ status: number; headers: Record<string, string>; body: string }> {
  const method = req.method;
  let responseStatus = 200;
  let responseHeaders: Record<string, string> = {};
  let responseBody = "";

  // Create a mock response object
  const res = {
    status: (status: number) => {
      responseStatus = status;
      return res;
    },
    setHeader: (name: string, value: string) => {
      responseHeaders[name] = value;
      return res;
    },
    getHeader: (name: string) => {
      return req.headers.get(name);
    },
    write: (chunk: string) => {
      responseBody += chunk;
      return true;
    },
    end: (data?: string) => {
      if (data) {
        responseBody += data;
      }
      return res;
    },
    headersSent: false,
    writeHead: (status: number, headers?: Record<string, string>) => {
      responseStatus = status;
      if (headers) {
        responseHeaders = { ...responseHeaders, ...headers };
      }
      return res;
    },
    getHeaderNames: () => {
      return Array.from(req.headers.keys());
    },
  };

  // Handle the request using the original method
  if (method === "POST" && body) {
    await this.handleRequest(req as any, res as any, body);
  } else {
    await this.handleRequest(req as any, res as any);
  }

  return {
    status: responseStatus,
    headers: responseHeaders,
    body: responseBody,
  };
};

export { StreamableHTTPServerTransport };
