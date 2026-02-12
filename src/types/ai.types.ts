// src/types/ai.types.ts
/**
 * AI-related TypeScript types
 */

export type AIProvider = 'openai' | 'anthropic' | 'gemini';

export type AIModel = 
  | 'gpt-4'
  | 'gpt-4-turbo'
  | 'gpt-3.5-turbo'
  | 'claude-3-opus'
  | 'claude-3-sonnet'
  | 'claude-3-haiku'
  | 'gemini-pro';

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    model?: AIModel;
    tokens?: number;
    cost?: number;
  };
}

export interface AIChatRequest {
  messages: AIMessage[];
  model?: AIModel;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

export interface AIChatResponse {
  message: AIMessage;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: AIModel;
  finishReason: 'stop' | 'length' | 'content_filter';
}

export interface AIStreamChunk {
  id: string;
  content: string;
  done: boolean;
}

export interface AIError {
  code: string;
  message: string;
  provider: AIProvider;
  statusCode?: number;
}

// Chat session types
export interface ChatSession {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  messages: AIMessage[];
  model: AIModel;
  metadata?: Record<string, any>;
}

export interface CreateChatSessionParams {
  title?: string;
  model?: AIModel;
  systemPrompt?: string;
}

// AI tool/function calling types
export interface AITool {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface AIToolCall {
  id: string;
  name: string;
  arguments: Record<string, any>;
}