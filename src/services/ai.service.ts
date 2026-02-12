// src/services/ai.service.ts
/**
 * AI Service
 * Handles all AI API interactions
 */

import { openai, anthropic } from '@/lib/aiClient';
import type {
  AIProvider,
  AIModel,
  AIMessage,
  AIChatRequest,
  AIChatResponse,
  AIError,
} from '@/types';

export class AIService {
  private provider: AIProvider;

  constructor(provider: AIProvider = 'openai') {
    this.provider = provider;
  }

  /**
   * Send chat completion request
   */
  async chat(request: AIChatRequest): Promise<AIChatResponse> {
    try {
      if (this.provider === 'openai') {
        return await this.chatWithOpenAI(request);
      } else if (this.provider === 'anthropic') {
        return await this.chatWithAnthropic(request);
      }
      
      throw new Error(`Unsupported provider: ${this.provider}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Stream chat completion
   */
  async streamChat(
    request: AIChatRequest,
    onChunk: (content: string) => void,
    onComplete: () => void,
    onError: (error: Error) => void
  ): Promise<void> {
    try {
      if (this.provider === 'openai' && openai) {
        const messages = request.messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        }));

        if (request.systemPrompt) {
          messages.unshift({
            role: 'system',
            content: request.systemPrompt,
          });
        }

        await openai.createStreamingCompletion({
          messages,
          model: request.model || 'gpt-4-turbo',
          temperature: request.temperature,
          maxTokens: request.maxTokens,
          onChunk,
          onComplete,
          onError,
        });
      } else {
        throw new Error(`Streaming not supported for ${this.provider}`);
      }
    } catch (error) {
      onError(error as Error);
    }
  }

  /**
   * Chat with OpenAI
   */
  private async chatWithOpenAI(request: AIChatRequest): Promise<AIChatResponse> {
    if (!openai) {
      throw new Error('OpenAI client not initialized');
    }

    const messages = request.messages.map(msg => ({
      role: msg.role,
      content: msg.content,
    }));

    if (request.systemPrompt) {
      messages.unshift({
        role: 'system',
        content: request.systemPrompt,
      });
    }

    const response = await openai.createChatCompletion({
      messages,
      model: request.model || 'gpt-4-turbo',
      temperature: request.temperature ?? 0.7,
      maxTokens: request.maxTokens ?? 1000,
    });

    const aiMessage: AIMessage = {
      id: response.id,
      role: 'assistant',
      content: response.choices[0].message.content,
      timestamp: new Date(),
      metadata: {
        model: response.model as AIModel,
        tokens: response.usage.total_tokens,
      },
    };

    return {
      message: aiMessage,
      usage: {
        promptTokens: response.usage.prompt_tokens,
        completionTokens: response.usage.completion_tokens,
        totalTokens: response.usage.total_tokens,
      },
      model: response.model as AIModel,
      finishReason: response.choices[0].finish_reason as any,
    };
  }

  /**
   * Chat with Anthropic (Claude)
   */
  private async chatWithAnthropic(request: AIChatRequest): Promise<AIChatResponse> {
    if (!anthropic) {
      throw new Error('Anthropic client not initialized');
    }

    const messages = request.messages.map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content,
    }));

    const response = await anthropic.createMessage({
      messages,
      model: request.model || 'claude-3-sonnet-20240229',
      maxTokens: request.maxTokens ?? 1000,
    });

    const aiMessage: AIMessage = {
      id: response.id,
      role: 'assistant',
      content: response.content[0].text,
      timestamp: new Date(),
      metadata: {
        model: response.model as AIModel,
      },
    };

    return {
      message: aiMessage,
      usage: {
        promptTokens: response.usage.input_tokens,
        completionTokens: response.usage.output_tokens,
        totalTokens: response.usage.input_tokens + response.usage.output_tokens,
      },
      model: response.model as AIModel,
      finishReason: response.stop_reason as any,
    };
  }

  /**
   * Generate text completion
   */
  async complete(prompt: string, options?: {
    model?: AIModel;
    temperature?: number;
    maxTokens?: number;
  }): Promise<string> {
    const response = await this.chat({
      messages: [
        {
          id: 'temp',
          role: 'user',
          content: prompt,
          timestamp: new Date(),
        },
      ],
      model: options?.model,
      temperature: options?.temperature,
      maxTokens: options?.maxTokens,
    });

    return response.message.content;
  }

  /**
   * Handle AI errors
   */
  private handleError(error: any): AIError {
    return {
      code: error.code || 'UNKNOWN_ERROR',
      message: error.message || 'An unknown error occurred',
      provider: this.provider,
      statusCode: error.status || error.statusCode,
    };
  }

  /**
   * Change AI provider
   */
  setProvider(provider: AIProvider): void {
    this.provider = provider;
  }
}

// Export singleton instance
export const aiService = new AIService('openai');