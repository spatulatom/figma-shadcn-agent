# MCP Chat Integration

This project demonstrates integration with the Model Context Protocol (MCP) to provide a standardized way to interact with various Large Language Models (LLMs).

## Features

- API route that implements an MCP server
- Chat interface that connects to the MCP server
- Support for multiple LLM providers:
  - OpenAI (GPT-4o, etc.)
  - Anthropic (Claude models)
  - Google (Gemini models)

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env.local` file in the root directory with your API keys:
   ```
   OPENAI_API_KEY=your_openai_api_key
   ANTHROPIC_API_KEY=your_anthropic_api_key
   GOOGLE_AI_API_KEY=your_google_ai_api_key
   ```
4. Run the development server:
   ```
   npm run dev
   ```
5. Navigate to `http://localhost:3000/chat` to access the chat interface

## How It Works

### MCP Server (API Route)

The MCP server is implemented as a Next.js API route at `/api/mcp`. It:

- Uses the MCP TypeScript SDK
- Creates tools for each LLM provider
- Exposes system info as a resource
- Manages session state

### Chat Interface

The chat interface is a client-side React component that:

- Connects to the MCP server using the StreamableHTTP transport
- Provides a form for entering prompts
- Allows switching between different LLM providers
- Displays the conversation history

## Technologies Used

- Next.js and React
- Model Context Protocol (MCP) TypeScript SDK
- OpenAI, Anthropic, and Google AI client libraries
- shadcn/ui components
- Tailwind CSS for styling
- Zod for validation

## Further Resources

- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP Specification](https://spec.modelcontextprotocol.io/)
- [OpenAI API](https://platform.openai.com/docs/api-reference)
- [Anthropic API](https://docs.anthropic.com/claude/reference/getting-started-with-the-api)
- [Google AI API](https://ai.google.dev/)
