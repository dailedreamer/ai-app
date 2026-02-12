// src/lib/aiClient.ts
/**
 * AI client configuration
 * Supports multiple AI providers (OpenAI, Anthropic, etc.)
 */

import { env } from '@/utils/env';
import type { AIProvider, AIModel } from '@/types';

/**
 * OpenAI client configuration
 */
export class OpenAIClient {
  private apiKey: string;
  private baseURL = 'https://api.openai.com/v1';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || env.ai.openaiKey;
    
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }
  }

  /**
   * Send chat completion request
   */
  async createChatCompletion(params: {
    messages: Array<{ role: string; content: string }>;
    model?: string;
    temperature?: number;
    maxTokens?: number;
    stream?: boolean;
  }) {
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: params.model || 'gpt-4-turbo',
        messages: params.messages,
        temperature: params.temperature ?? 0.7,
        max_tokens: params.maxTokens ?? 1000,
        stream: params.stream ?? false,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI API error');
    }

    return response.json();
  }

  /**
   * Create streaming chat completion
   */
  async createStreamingCompletion(params: {
    messages: Array<{ role: string; content: string }>;
    model?: string;
    temperature?: number;
    maxTokens?: number;
    onChunk: (chunk: string) => void;
    onComplete: () => void;
    onError: (error: Error) => void;
  }) {
    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: params.model || 'gpt-4-turbo',
          messages: params.messages,
          temperature: params.temperature ?? 0.7,
          max_tokens: params.maxTokens ?? 1000,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          params.onComplete();
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            if (data === '[DONE]') {
              params.onComplete();
              return;
            }

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content;
              
              if (content) {
                params.onChunk(content);
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      params.onError(error as Error);
    }
  }
}

/**
 * Anthropic client (Claude API)
 * Add similar implementation if using Anthropic
 */
export class AnthropicClient {
  private apiKey: string;
  private baseURL = 'https://api.anthropic.com/v1';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || env.ai.anthropicKey;
    
    if (!this.apiKey) {
      throw new Error('Anthropic API key not configured');
    }
  }

  async createMessage(params: {
    messages: Array<{ role: string; content: string }>;
    model?: string;
    maxTokens?: number;
  }) {
    const response = await fetch(`${this.baseURL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: params.model || 'claude-3-sonnet-20240229',
        messages: params.messages,
        max_tokens: params.maxTokens ?? 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Anthropic API error');
    }

    return response.json();
  }
}

/**
 * Factory function to get AI client based on provider
 */
export function getAIClient(provider: AIProvider = 'openai') {
  switch (provider) {
    case 'openai':
      return new OpenAIClient();
    case 'anthropic':
      return new AnthropicClient();
    default:
      throw new Error(`Unsupported AI provider: ${provider}`);
  }
}

// Export singleton instances
export const openai = env.ai.openaiKey ? new OpenAIClient() : null;
export const anthropic = env.ai.anthropicKey ? new AnthropicClient() : null;