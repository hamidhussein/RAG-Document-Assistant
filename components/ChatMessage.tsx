
import React from 'react';
import { ChatMessage as ChatMessageType } from '../types';
import { UserIcon, BotIcon } from './Icons';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  return (
    <div className={`flex items-start gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 flex-shrink-0 rounded-full bg-slate-700 flex items-center justify-center">
            <BotIcon className="w-5 h-5 text-sky-400"/>
        </div>
      )}
      <div
        className={`rounded-lg px-4 py-3 max-w-xl whitespace-pre-wrap ${
          isUser
            ? 'bg-sky-600 text-white'
            : 'bg-slate-800 text-slate-300'
        }`}
      >
        {message.text}
      </div>
      {isUser && (
        <div className="w-8 h-8 flex-shrink-0 rounded-full bg-slate-700 flex items-center justify-center">
            <UserIcon className="w-5 h-5 text-slate-400"/>
        </div>
      )}
    </div>
  );
};
