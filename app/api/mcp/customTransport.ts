import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

export class CustomStreamableHTTPClientTransport extends StreamableHTTPClientTransport {
  constructor(url: URL, options: any = {}) {
    // Inject headers into the options
    const modifiedOptions = {
      ...options,
      fetchOptions: {
        ...options.fetchOptions,
        headers: {
          ...options.fetchOptions?.headers,
          Accept: "application/json, text/event-stream",
          "Content-Type": "application/json",
        },
      },
    };

    super(url, modifiedOptions);
  }
}
