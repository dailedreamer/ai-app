// src/pages/ChatPage.tsx
/**
 * ChatPage Component
 * AI chat interface with responsive design
 */

import { useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useChat } from '@/hooks/useChat';
import { ChatMessage } from '@/components/features/chat/ChatMessage';
import { ChatInput } from '@/components/features/chat/ChatInput';
import { PageSpinner } from '@/components/ui/Spinner';
import { Bot } from 'lucide-react';

export function ChatPage() {
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    messages,
    loading,
    streaming,
    error,
    sendMessage,
  } = useChat({
    userId: user?.id || '',
    model: 'gpt-4-turbo',
  });

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading && messages.length === 0) {
    return <PageSpinner />;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-5rem)]">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md px-4">
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                <Bot className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                Start a conversation
              </h2>
              <p className="text-sm md:text-base text-gray-600">
                Ask me anything! I'm here to help you with information,
                creative tasks, and problem-solving.
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            
            {streaming && (
              <div className="flex gap-2 items-center text-gray-500 text-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span>AI is typing...</span>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error.message}</p>
            </div>
          )}
          
          <ChatInput
            onSend={sendMessage}
            disabled={streaming}
            placeholder="Type your message... (Shift+Enter for new line)"
          />
          
          <p className="text-xs text-gray-500 mt-2 text-center">
            AI can make mistakes. Check important info.
          </p>
        </div>
      </div>
    </div>
  );
}