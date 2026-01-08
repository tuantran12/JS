"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm SENKAI AI, your intelligent crypto trading assistant. I can help you with market analysis, trading strategies, Solana blockchain insights, and more. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Prepare messages for API (exclude welcome message)
      const apiMessages = messages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      apiMessages.push({
        role: "user",
        content: userMessage.content,
      });

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: apiMessages,
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get response");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error("Chat error:", error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I apologize, but I encountered an error: ${
          error.message || "Unknown error"
        }. Please try again or contact support if the issue persists.`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    "What are the current Solana market trends?",
    "Explain copy trading on SENKAI",
    "How do I manage trading risk?",
    "What is the SENKAI token?",
  ];

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-[#FFFF02]/20 bg-[#0a0a0a]/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#FFFF02]/10 rounded-lg">
                <Bot className="h-6 w-6 md:h-8 md:w-8 text-[#FFFF02]" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold">
                  SENKAI <span className="text-[#FFFF02]">AI Chat</span>
                </h1>
                <p className="text-xs text-gray-500 hidden md:block">
                  Powered by Mistral-7B-Instruct
                </p>
              </div>
            </div>
            <Link
              href="/"
              className="text-sm text-gray-400 hover:text-[#FFFF02] transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 container mx-auto px-4 md:px-8 py-6 max-w-4xl flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto mb-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-[#FFFF02]/10 rounded-full flex items-center justify-center">
                    <Bot className="h-6 w-6 text-[#FFFF02]" />
                  </div>
                </div>
              )}

              <div
                className={`max-w-[80%] md:max-w-[70%] ${
                  message.role === "user"
                    ? "bg-[#FFFF02] text-[#0a0a0a]"
                    : "bg-[#1a1a1a] border border-[#FFFF02]/20"
                } rounded-2xl px-4 md:px-6 py-3 md:py-4`}
              >
                <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
                <p
                  className={`text-xs mt-2 ${
                    message.role === "user"
                      ? "text-[#0a0a0a]/60"
                      : "text-gray-500"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              {message.role === "user" && (
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-[#FFFF02]/20 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-[#FFFF02]" />
                  </div>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-4 justify-start">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-[#FFFF02]/10 rounded-full flex items-center justify-center">
                  <Bot className="h-6 w-6 text-[#FFFF02]" />
                </div>
              </div>
              <div className="bg-[#1a1a1a] border border-[#FFFF02]/20 rounded-2xl px-6 py-4">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 text-[#FFFF02] animate-spin" />
                  <span className="text-sm text-gray-400">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        {messages.length === 1 && !isLoading && (
          <div className="mb-4">
            <p className="text-sm text-gray-400 mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#FFFF02]" />
              Quick prompts:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {quickPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickPrompt(prompt)}
                  className="text-left text-sm px-4 py-3 bg-[#1a1a1a] border border-[#FFFF02]/20 rounded-lg hover:border-[#FFFF02] hover:bg-[#FFFF02]/10 transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#1a1a1a] border border-[#FFFF02]/20 rounded-2xl p-4 flex gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about crypto trading..."
            className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-sm md:text-base"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-4 md:px-6 py-2 bg-[#FFFF02] text-[#0a0a0a] font-semibold rounded-lg hover:bg-[#FFFF33] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 md:h-5 md:w-5 animate-spin" />
            ) : (
              <>
                <Send className="h-4 w-4 md:h-5 md:w-5" />
                <span className="hidden md:inline">Send</span>
              </>
            )}
          </button>
        </form>

        {/* Disclaimer */}
        <p className="text-xs text-gray-500 text-center mt-4">
          AI-generated responses may contain errors. Always do your own research
          before making trading decisions.
        </p>
      </div>
    </div>
  );
}
