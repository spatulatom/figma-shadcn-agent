"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

// Define form schema with strictly typed values
const formSchema = z.object({
  prompt: z.string().min(1, "Please enter a prompt"),
  model: z.string(), // Removed default here, will be set in useForm
  temperature: z.number().min(0).max(1),
});

// Create a type from the schema
type FormValues = z.infer<typeof formSchema>;

type Message = {
  role: "user" | "assistant";
  content: string;
  model?: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [client, setClient] = useState<Client | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeModel, setActiveModel] = useState<
    "chatGPT" | "claude" | "gemini"
  >("chatGPT");
  const scrollRef = useRef<HTMLDivElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      model: "gpt-4o", // Default model set here
      temperature: 0.7,
    },
  });

  // Connect to the MCP server
  useEffect(() => {
    const connectToServer = async () => {
      try {
        setIsConnecting(true);
        const transport = new StreamableHTTPClientTransport(
          new URL("/api/mcp", window.location.origin)
        );

        const newClient = new Client({
          name: "chat-client",
          version: "1.0.0",
        });

        await newClient.connect(transport);
        setClient(newClient);
      } catch (error) {
        console.error("Failed to connect to MCP server:", error);
      } finally {
        setIsConnecting(false);
      }
    };

    connectToServer();

    return () => {
      // Clean up the connection when component unmounts
      if (client) {
        client.close();
      }
    };
  }, []);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Update the default model when tab changes
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

      // Safely access the content
      let responseText = "No response";
      // Ensure result.content is an array and has elements
      if (Array.isArray(result.content) && result.content.length > 0) {
        const firstBlock = result.content[0];
        // Check if the firstBlock is a ContentBlock and has a text property
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
          // Handle cases where content might be nested differently but is still a text block
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
                          message.role === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.role === "user"
                              ? "bg-blue-500 text-white"
                              : "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                          }`}
                        >
                          <div className="whitespace-pre-wrap">
                            {message.content}
                          </div>
                          {message.model && message.role === "assistant" && (
                            <div className="text-xs mt-1 opacity-70">
                              Model: {message.model}
                            </div>
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
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
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
                          <Button
                            type="submit"
                            disabled={isProcessing || isConnecting || !client}
                          >
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
