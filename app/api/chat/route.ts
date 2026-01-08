import { NextRequest, NextResponse } from "next/server";
import { createChatCompletion, ChatMessage } from "@/lib/api/huggingface";

export const runtime = "edge";

interface ChatRequestBody {
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
}

/**
 * POST /api/chat
 * Handle chat completion requests
 */
export async function POST(request: NextRequest) {
  try {
    const body: ChatRequestBody = await request.json();

    // Validate request
    if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    // Add system message if not present
    const messages = body.messages;
    const hasSystemMessage = messages.some((m) => m.role === "system");

    if (!hasSystemMessage) {
      messages.unshift({
        role: "system",
        content: `You are SENKAI AI, an expert crypto trading assistant specializing in Solana blockchain and DeFi.
You provide accurate, actionable trading insights and market analysis.
You help users understand market trends, execute smart trades, and manage risk.
Always prioritize user safety and remind them that crypto trading involves risk.
Keep your responses concise, clear, and professional.`,
      });
    }

    // Call Hugging Face API
    const response = await createChatCompletion({
      messages,
      temperature: body.temperature,
      max_tokens: body.max_tokens,
    });

    return NextResponse.json({
      message: response,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Chat API error:", error);

    // Handle specific error types
    if (error.message?.includes("HUGGINGFACE_API_KEY")) {
      return NextResponse.json(
        {
          error: "AI service is not configured. Please contact support.",
          details: "Missing API configuration",
        },
        { status: 503 }
      );
    }

    if (error.message?.includes("Hugging Face API error")) {
      return NextResponse.json(
        {
          error: "AI service is temporarily unavailable. Please try again later.",
          details: error.message,
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to process chat request",
        details: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/chat
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "SENKAI AI Chat",
    model: "Mistral-7B-Instruct-v0.2",
    timestamp: new Date().toISOString(),
  });
}
