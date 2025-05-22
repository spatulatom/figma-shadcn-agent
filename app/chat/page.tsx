"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { CustomStreamableHTTPClientTransport } from "@/app/api/mcp/customTransport";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  prompt: z.string().min(1, "Please enter a prompt"),
  model: z.string(),
  temperature: z.number().min(0).max(1),
});

type FormValues = z.infer<typeof formSchema>;

type Message = {
  role: "user" | "assistant";
  content: string;
  model?: string;
};

const InitializeResultSchema = z.object({
  protocolVersion: z.string(),
});

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [client, setClient] = useState<Client | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeModel, setActiveModel] = useState<"chatGPT" | "claude" | "gemini">("chatGPT");
  const scrollRef = useRef<HTMLDivElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      model: "gpt-4o",
      temperature: 0.7,
    },
  });

  useEffect(() => {
  const connectToServer = async () => {
    try {
      setIsConnecting(true);
      console.log("Initializing MCP client with URL:", "/api/mcp");

      const transport = new CustomStreamableHTTPClientTransport(
        new URL("/api/mcp", window.location.origin),
        {
          defaultRequestInit: {
            headers: {
              Accept: "application/json, text/event-stream",
              "Content-Type": "application/json",
            },
          },
        }
      );

      console.log("Transport created with options:", {
        defaultRequestInit: {
          headers: {
            Accept: "application/json, text/event-stream",
            "Content-Type": "application/json",
          },
        },
      });

      const newClient = new Client({
        name: "chat-client",
        version: "1.0.0",
      });

      console.log("Connecting client to transport...");
      await newClient.connect(transport);
      console.log("Client connected, sessionId:", transport.sessionId);

      const initRequest = {
        jsonrpc: "2.0",
        method: "initialize",
        params: {
          protocolVersion: "1.0.0", // Match server expectation
          capabilities: {},
          clientInfo: {
            name: "chat-client",
            version: "1.0.0",
          },
        },
        id: 1, // Use a positive integer
      };
      console.log("Sending initialize request:", initRequest);

      const result = await newClient.request(
        initRequest,
        InitializeResultSchema,
        {}
      );
      console.log("Initialize response:", result);
      console.log("Transport sessionId after initialize:", transport.sessionId);

      setClient(newClient);
    } catch (error) {
      console.error("Failed to connect to MCP server:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  connectToServer();

  return () => {
    if (client) {
      client.close();
    }
  };
}, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const defaultModels = {
      chatGPT: "gpt-4o",
      claude: "claude-3-opus-20240229",
      gemini: "gemini-1.5-pro",
    };

    form.setValue("model", defaultModels[activeModel]);
  }, [activeModel, form]);

  const onSubmit = async (data: FormValues) => {
    if (!client) return;

    const userMessage: Message = {
      role: "user",
      content: data.prompt,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsProcessing(true);
    form.reset({
      prompt: "",
      model: data.model,
      temperature: data.temperature,
    });

    try {
      const result = await client.callTool({
        name: activeModel,
        arguments: {
          prompt: data.prompt,
          model: data.model,
          temperature: data.temperature,
        },
      });

      let responseText = "No response";
      if (Array.isArray(result.content) && result.content.length > 0) {
        const firstBlock = result.content[0];
        if (
          firstBlock &&
          typeof firstBlock === "object" &&
          "text" in firstBlock &&
          typeof firstBlock.text === "string"
        ) {
          responseText = firstBlock.text;
        } else if (
          firstBlock &&
          typeof firstBlock === "object" &&
          "type" in firstBlock &&
          firstBlock.type === "text" &&
          "text" in firstBlock &&
          typeof firstBlock.text === "string"
        ) {
          responseText = firstBlock.text;
        }
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: responseText,
        model: data.model,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error calling tool:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: `Error: ${(error as Error).message || "Unknown error"}`,
        model: data.model,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>AI Chat</CardTitle>
          <CardDescription>
            Chat with different AI models using the Model Context Protocol
          </CardDescription>
        </CardHeader>

        <Tabs
          value={activeModel}
          onValueChange={(value) => setActiveModel(value as any)}
        >
          <div className="px-6">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="chatGPT">OpenAI</TabsTrigger>
              <TabsTrigger value="claude">Anthropic</TabsTrigger>
              <TabsTrigger value="gemini">Google</TabsTrigger>
            </TabsList>
          </div>

          <CardContent>
            <div
              ref={scrollRef}
              className="h-[400px] overflow-y-auto mb-4 border rounded-md p-4 bg-gray-50 dark:bg-gray-900"
            >
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 h-full flex items-center justify-center">
                  <p>Start a conversation by sending a message below.</p>
                </div>
              ) : (
                <>
                  {messages.map((message, index) => (
                    <div key={index} className="mb-4">
                      <div
                        className={`flex items-start gap-2 ${
                          message.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.role === "user"
                              ? "bg-blue-500 text-white"
                              : "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                          }`}
                        >
                          <div className="whitespace-pre-wrap">{message.content}</div>
                          {message.model && message.role === "assistant" && (
                            <div className="text-xs mt-1 opacity-70">Model: {message.model}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>

            <Separator className="my-4" />

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Model</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isProcessing} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="temperature"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Temperature</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            max="1"
                            step="0.1"
                            {...field}
                            onChange={(e) => {
                              field.onChange(parseFloat(e.target.value));
                            }}
                            disabled={isProcessing}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Type your message here..."
                            {...field}
                            disabled={isProcessing || isConnecting || !client}
                          />
                          <Button type="submit" disabled={isProcessing || isConnecting || !client}>
                            {isProcessing ? "Sending..." : "Send"}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
        </Tabs>

        <CardFooter className="flex justify-between text-sm text-gray-500">
          <div>
            {isConnecting
              ? "Connecting to server..."
              : client
              ? "Connected to MCP server"
              : "Failed to connect to server"}
          </div>
          <div>Powered by Model Context Protocol</div>
        </CardFooter>
      </Card>
    </div>
  );
}