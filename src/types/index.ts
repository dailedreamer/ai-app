// src/types/index.ts
/**
 * Central export point for all types
 * Import types like: import { User, AIMessage } from '@/types'
 */

// AI types
export type {
    AIProvider,
    AIModel,
    AIMessage,
    AIChatRequest,
    AIChatResponse,
    AIStreamChunk,
    AIError,
    ChatSession,
    CreateChatSessionParams,
    AITool,
    AIToolCall,
  } from './ai.types';
  
  // Auth types
  export type {
    User,
    UserRole,
    SubscriptionTier,
    AuthSession,
    LoginCredentials,
    SignupCredentials,
    AuthError,
  } from './auth.types';
  
  // Database types
  export type {
    Database,
    ChatSessionRow,
    ChatSessionInsert,
    ChatSessionUpdate,
    ChatMessageRow,
    ChatMessageInsert,
    ChatMessageUpdate,
    UserProfileRow,
    UserProfileInsert,
    UserProfileUpdate,
  } from './database.types';
  
  // Common utility types
  export interface ApiResponse<T> {
    data: T | null;
    error: ApiError | null;
    loading: boolean;
  }
  
  export interface ApiError {
    message: string;
    code?: string;
    statusCode?: number;
  }
  
  export interface PaginationParams {
    page: number;
    pageSize: number;
  }
  
  export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }