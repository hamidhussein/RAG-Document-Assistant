
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage as ChatMessageType } from '../types';
import { ChatMessage } from './ChatMessage';
import { SendIcon } from './Icons';
import { Spinner } from './Spinner';

interface ChatWindowProps {
  chatHistory: ChatMessageType[];
  onSendMessage: (message: string) => void;
  isResponding: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ chatHistory, onSendMessage, isResponding }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [chatHistory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isResponding) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {chatHistory.length === 0 ? (
           <div className="flex flex-col items-center justify-center h-full text-center">
             <div className="bg-slate-800 p-6 rounded-lg">
                <h2 className="text-2xl font-semibold text-slate-200">Welcome!</h2>
                <p className="mt-2 text-slate-400">Upload a document and ask a question to get started.</p>
             </div>
           </div>
        ) : (
            chatHistory.map((msg, index) => <ChatMessage key={index} message={msg} />)
        )}
        {isResponding && (
          <div className="flex justify-start">
             <div className="flex items-center space-x-3 bg-slate-800 rounded-lg p-3 max-w-lg">
                <Spinner className="w-5 h-5 text-sky-400" />
                <p className="text-slate-300">Thinking...</p>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-slate-800/50 border-t border-slate-700">
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder={isResponding ? "Waiting for response..." : "Ask a question about your documents..."}
            className="w-full bg-slate-800 text-slate-200 rounded-lg p-3 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
            rows={1}
            disabled={isResponding}
            style={{ minHeight: '48px', maxHeight: '150px' }}
          />
          <button
            type="submit"
            disabled={isResponding || !input.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-sky-600 text-white disabled:bg-slate-600 disabled:cursor-not-allowed hover:bg-sky-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-400"
            aria-label="Send message"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
