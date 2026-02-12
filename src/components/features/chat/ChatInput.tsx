// src/components/features/chat/ChatInput.tsx
/**
 * ChatInput Component
 * Input field for chat messages
 */

import { useState, FormEvent, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  disabled = false,
  placeholder = 'Type your message...',
}: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        className="w-full px-4 py-3 pr-12 bg-white border border-gray-300 rounded-lg
                 text-gray-900 placeholder-gray-400
                 resize-none overflow-hidden
                 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                 disabled:bg-gray-100 disabled:cursor-not-allowed
                 transition-all duration-200"
        style={{
          minHeight: '48px',
          maxHeight: '200px',
        }}
        onInput={(e) => {
          const target = e.target as HTMLTextAreaElement;
          target.style.height = '48px';
          target.style.height = `${target.scrollHeight}px`;
        }}
      />
      
      <Button
        type="submit"
        variant="primary"
        size="sm"
        disabled={!input.trim() || disabled}
        className="absolute right-2 bottom-2"
        icon={<Send className="w-4 h-4" />}
      >
        <span className="sr-only">Send</span>
      </Button>
    </form>
  );
}