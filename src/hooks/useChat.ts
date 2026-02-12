// src/hooks/useChat.ts
/**
 * useChat Hook
 * Manages AI chat sessions and messages
 */

import { useState, useEffect, useCallback } from 'react';
import { aiService } from '@/services/ai.service';
import { dataService } from '@/services/data.service';
import type { AIMessage, ChatSession } from '@/types';

interface UseChatParams {
  sessionId?: string;
  userId: string;
  model?: string;
}

interface UseChatReturn {
  messages: AIMessage[];
  loading: boolean;
  streaming: boolean;
  error: Error | null;
  session: ChatSession | null;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  deleteMessage: (messageId: string) => Promise<void>;
}

export function useChat({ sessionId, userId, model }: UseChatParams): UseChatReturn {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [session, setSession] = useState<ChatSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Load session and messages
  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      if (!sessionId) return;

      try {
        setLoading(true);
        const sessionData = await dataService.getChatSession(sessionId);
        
        if (mounted) {
          setSession(sessionData);
          setMessages(sessionData.messages);
        }
      } catch (err) {
        console.error('Error loading session:', err);
        if (mounted) {
          setError(err as Error);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadSession();

    return () => {
      mounted = false;
    };
  }, [sessionId]);

  // Subscribe to realtime updates
  useEffect(() => {
    if (!sessionId) return;

    const unsubscribe = dataService.subscribeToSession(
      sessionId,
      (newMessage) => {
        setMessages(prev => [...prev, newMessage]);
      }
    );

    return unsubscribe;
  }, [sessionId]);

  const sendMessage = useCallback(async (content: string) => {
    try {
      setLoading(true);
      setError(null);

      // Create session if it doesn't exist
      let currentSession = session;
      if (!currentSession) {
        currentSession = await dataService.createChatSession(userId, {
          title: content.slice(0, 50),
          model,
        });
        setSession(currentSession);
      }

      // Create user message
      const userMessage: AIMessage = {
        id: `temp-${Date.now()}`,
        role: 'user',
        content,
        timestamp: new Date(),
      };

      // Add user message to state
      setMessages(prev => [...prev, userMessage]);

      // Save user message to database
      await dataService.addMessage(currentSession.id, userMessage);

      // Get AI response with streaming
      setStreaming(true);
      let assistantContent = '';
      const assistantMessageId = `assistant-${Date.now()}`;

      // Create placeholder for assistant message
      const assistantMessage: AIMessage = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);

      await aiService.streamChat(
        {
          messages: [...messages, userMessage],
          model: model as any,
        },
        // On chunk
        (chunk) => {
          assistantContent += chunk;
          setMessages(prev => 
            prev.map(msg => 
              msg.id === assistantMessageId
                ? { ...msg, content: assistantContent }
                : msg
            )
          );
        },
        // On complete
        async () => {
          setStreaming(false);
          
          // Save final assistant message
          const finalMessage: AIMessage = {
            id: assistantMessageId,
            role: 'assistant',
            content: assistantContent,
            timestamp: new Date(),
          };
          
          await dataService.addMessage(currentSession!.id, finalMessage);
        },
        // On error
        (err) => {
          setError(err);
          setStreaming(false);
        }
      );
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [session, userId, model, messages]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const deleteMessage = useCallback(async (messageId: string) => {
    try {
      await dataService.deleteMessage(messageId);
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
    } catch (err) {
      console.error('Error deleting message:', err);
      setError(err as Error);
    }
  }, []);

  return {
    messages,
    loading,
    streaming,
    error,
    session,
    sendMessage,
    clearMessages,
    deleteMessage,
  };
}