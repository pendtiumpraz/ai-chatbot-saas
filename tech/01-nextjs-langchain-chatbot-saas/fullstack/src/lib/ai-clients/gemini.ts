// Google Gemini AI Client
import { decrypt } from '@/lib/encryption';

export interface GeminiMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{ text: string }>;
      role: string;
    };
    finishReason: string;
  }>;
  usageMetadata?: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
}

export class GeminiClient {
  private apiKey: string;
  private model: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta';

  constructor(encryptedKey: string, model: string = 'gemini-2.0-flash') {
    this.apiKey = decrypt(encryptedKey);
    this.model = model;
  }

  async generateContent(
    messages: GeminiMessage[],
    options?: {
      temperature?: number;
      maxTokens?: number;
      topP?: number;
    }
  ): Promise<GeminiResponse> {
    const url = `${this.baseUrl}/models/${this.model}:generateContent?key=${this.apiKey}`;

    const body: any = {
      contents: messages.map(msg => ({
        role: msg.role,
        parts: msg.parts,
      })),
    };

    // Add generation config if options provided
    if (options) {
      body.generationConfig = {
        temperature: options.temperature,
        maxOutputTokens: options.maxTokens,
        topP: options.topP,
      };
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      const errorMessage = error.error?.message || 'Gemini API error';
      
      // Check for rate limit
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Gemini free tier allows 15 requests/minute. Please wait a moment or upgrade your API key.');
      }
      
      // Check for quota
      if (errorMessage.includes('Resource exhausted') || errorMessage.includes('quota')) {
        throw new Error('API quota exceeded. Free tier: 60 requests/hour. Please wait or add billing to your Google Cloud account.');
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async chat(
    prompt: string,
    systemPrompt?: string,
    conversationHistory?: Array<{ role: string; content: string }>,
    options?: {
      temperature?: number;
      maxTokens?: number;
      topP?: number;
    }
  ): Promise<{
    content: string;
    usage: {
      promptTokens: number;
      completionTokens: number;
      totalTokens: number;
    };
  }> {
    // Build messages array
    const messages: GeminiMessage[] = [];

    // Add system prompt as first user message (Gemini doesn't have system role)
    if (systemPrompt) {
      messages.push({
        role: 'user',
        parts: [{ text: `System Instructions: ${systemPrompt}` }],
      });
      messages.push({
        role: 'model',
        parts: [{ text: 'Understood. I will follow these instructions.' }],
      });
    }

    // Add conversation history
    if (conversationHistory && conversationHistory.length > 0) {
      conversationHistory.forEach(msg => {
        messages.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        });
      });
    }

    // Add current prompt
    messages.push({
      role: 'user',
      parts: [{ text: prompt }],
    });

    // Generate response
    const response = await this.generateContent(messages, options);

    const candidate = response.candidates[0];
    const content = candidate.content.parts[0].text;

    return {
      content,
      usage: {
        promptTokens: response.usageMetadata?.promptTokenCount || 0,
        completionTokens: response.usageMetadata?.candidatesTokenCount || 0,
        totalTokens: response.usageMetadata?.totalTokenCount || 0,
      },
    };
  }

  // List available models
  static async listModels(apiKey: string): Promise<string[]> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to list Gemini models');
    }

    const data = await response.json();
    return data.models
      .filter((m: any) => m.supportedGenerationMethods?.includes('generateContent'))
      .map((m: any) => m.name.replace('models/', ''));
  }
}

export default GeminiClient;
