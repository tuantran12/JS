/**
 * Hugging Face API Client
 * Integrates with Mistral-7B-Instruct-v0.2 for AI-powered trading insights
 */

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatCompletionOptions {
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

const HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";

/**
 * Send a chat completion request to Hugging Face API
 */
export async function createChatCompletion(
  options: ChatCompletionOptions
): Promise<string> {
  const apiKey = process.env.HUGGINGFACE_API_KEY;

  if (!apiKey) {
    throw new Error("HUGGINGFACE_API_KEY is not configured");
  }

  // Format messages for Mistral instruction format
  const formattedPrompt = formatMessagesForMistral(options.messages);

  const response = await fetch(HUGGINGFACE_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: formattedPrompt,
      parameters: {
        temperature: options.temperature || 0.7,
        max_new_tokens: options.max_tokens || 1024,
        return_full_text: false,
        do_sample: true,
        top_p: 0.95,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Hugging Face API error: ${response.status} - ${error}`);
  }

  const result = await response.json();

  // Handle different response formats
  if (Array.isArray(result) && result.length > 0) {
    return result[0].generated_text || "";
  } else if (result.generated_text) {
    return result.generated_text;
  } else {
    throw new Error("Unexpected response format from Hugging Face API");
  }
}

/**
 * Format messages for Mistral instruction format
 * Format: <s>[INST] {user message} [/INST] {assistant response}</s>
 */
function formatMessagesForMistral(messages: ChatMessage[]): string {
  let prompt = "";

  // Add system message if present
  const systemMessage = messages.find((m) => m.role === "system");
  if (systemMessage) {
    prompt += `${systemMessage.content}\n\n`;
  }

  // Add conversation history
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];

    if (message.role === "system") continue;

    if (message.role === "user") {
      prompt += `<s>[INST] ${message.content} [/INST]`;
    } else if (message.role === "assistant") {
      prompt += ` ${message.content}</s>`;
    }
  }

  return prompt;
}

/**
 * Get trading insights based on market data and user query
 */
export async function getTradingInsights(
  query: string,
  context?: {
    marketData?: any;
    portfolio?: any;
  }
): Promise<string> {
  const systemPrompt = `You are SENKAI AI, an expert crypto trading assistant specializing in Solana blockchain and DeFi.
You provide accurate, actionable trading insights and market analysis.
You help users understand market trends, execute smart trades, and manage risk.
Always prioritize user safety and remind them that crypto trading involves risk.`;

  let userPrompt = query;

  // Add context if available
  if (context?.marketData) {
    userPrompt += `\n\nCurrent Market Data: ${JSON.stringify(context.marketData)}`;
  }
  if (context?.portfolio) {
    userPrompt += `\n\nUser Portfolio: ${JSON.stringify(context.portfolio)}`;
  }

  const response = await createChatCompletion({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 1024,
  });

  return response;
}
