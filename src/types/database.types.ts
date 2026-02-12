// src/types/database.types.ts
/**
 * Supabase database types
 * Generate these with: npx supabase gen types typescript --local > src/types/database.types.ts
 */

export interface Database {
    public: {
      Tables: {
        chat_sessions: {
          Row: ChatSessionRow;
          Insert: ChatSessionInsert;
          Update: ChatSessionUpdate;
        };
        chat_messages: {
          Row: ChatMessageRow;
          Insert: ChatMessageInsert;
          Update: ChatMessageUpdate;
        };
        user_profiles: {
          Row: UserProfileRow;
          Insert: UserProfileInsert;
          Update: UserProfileUpdate;
        };
      };
    };
  }
  
  // Chat Sessions
  export interface ChatSessionRow {
    id: string;
    user_id: string;
    title: string;
    model: string;
    created_at: string;
    updated_at: string;
    metadata: Record<string, any> | null;
  }
  
  export type ChatSessionInsert = Omit<ChatSessionRow, 'id' | 'created_at' | 'updated_at'>;
  export type ChatSessionUpdate = Partial<ChatSessionInsert>;
  
  // Chat Messages
  export interface ChatMessageRow {
    id: string;
    session_id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    created_at: string;
    metadata: Record<string, any> | null;
  }
  
  export type ChatMessageInsert = Omit<ChatMessageRow, 'id' | 'created_at'>;
  export type ChatMessageUpdate = Partial<ChatMessageInsert>;
  
  // User Profiles
  export interface UserProfileRow {
    id: string;
    email: string;
    name: string | null;
    avatar_url: string | null;
    role: 'user' | 'admin' | 'moderator';
    subscription_tier: 'free' | 'pro' | 'enterprise';
    created_at: string;
    updated_at: string;
  }
  
  export type UserProfileInsert = Omit<UserProfileRow, 'id' | 'created_at' | 'updated_at'>;
  export type UserProfileUpdate = Partial<UserProfileInsert>;