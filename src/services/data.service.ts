// src/services/data.service.ts
/**
 * Data Service
 * Handles all database CRUD operations via Supabase
 */

import { supabase } from '@/lib/supabase';
import type {
  ChatSession,
  AIMessage,
  ChatSessionInsert,
  ChatMessageInsert,
} from '@/types';

export class DataService {
  /**
   * CHAT SESSIONS
   */

  async createChatSession(userId: string, data: {
    title?: string;
    model?: string;
  }): Promise<ChatSession> {
    const insert: ChatSessionInsert = {
      user_id: userId,
      title: data.title || 'New Chat',
      model: data.model || 'gpt-4-turbo',
      metadata: null,
    };

    const { data: session, error } = await supabase
      .from('chat_sessions')
      .insert(insert)
      .select()
      .single();

    if (error) throw error;

    return this.mapChatSession(session);
  }

  async getChatSession(sessionId: string): Promise<ChatSession> {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select(`
        *,
        chat_messages (*)
      `)
      .eq('id', sessionId)
      .single();

    if (error) throw error;

    return this.mapChatSession(data);
  }

  async getUserChatSessions(userId: string, limit = 20): Promise<ChatSession[]> {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data.map(this.mapChatSession);
  }

  async updateChatSession(sessionId: string, updates: {
    title?: string;
  }): Promise<void> {
    const { error } = await supabase
      .from('chat_sessions')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', sessionId);

    if (error) throw error;
  }

  async deleteChatSession(sessionId: string): Promise<void> {
    const { error } = await supabase
      .from('chat_sessions')
      .delete()
      .eq('id', sessionId);

    if (error) throw error;
  }

  /**
   * CHAT MESSAGES
   */

  async addMessage(sessionId: string, message: AIMessage): Promise<void> {
    const insert: ChatMessageInsert = {
      session_id: sessionId,
      role: message.role,
      content: message.content,
      metadata: message.metadata || null,
    };

    const { error } = await supabase
      .from('chat_messages')
      .insert(insert);

    if (error) throw error;

    // Update session's updated_at
    await this.updateChatSession(sessionId, {});
  }

  async getMessages(sessionId: string): Promise<AIMessage[]> {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return data.map(this.mapMessage);
  }

  async deleteMessage(messageId: string): Promise<void> {
    const { error } = await supabase
      .from('chat_messages')
      .delete()
      .eq('id', messageId);

    if (error) throw error;
  }

  /**
   * REALTIME SUBSCRIPTIONS
   */

  subscribeToSession(
    sessionId: string,
    onMessage: (message: AIMessage) => void
  ): () => void {
    const channel = supabase
      .channel(`session:${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          onMessage(this.mapMessage(payload.new));
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }

  /**
   * HELPER MAPPERS
   */

  private mapChatSession(data: any): ChatSession {
    return {
      id: data.id,
      title: data.title,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      userId: data.user_id,
      model: data.model,
      messages: data.chat_messages?.map(this.mapMessage) || [],
      metadata: data.metadata,
    };
  }

  private mapMessage(data: any): AIMessage {
    return {
      id: data.id,
      role: data.role,
      content: data.content,
      timestamp: new Date(data.created_at),
      metadata: data.metadata,
    };
  }
}

// Export singleton instance
export const dataService = new DataService();