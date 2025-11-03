import React from 'react';
import { BotIcon, ScissorsIcon, CubeTransparentIcon, MagnifyingGlassIcon } from './Icons';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Step: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="flex items-start space-x-4">
    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-slate-900/50 border border-slate-700 flex items-center justify-center">
      {icon}
    </div>
    <div>
      <h3 className="text-md font-semibold text-slate-200">{title}</h3>
      <p className="text-sm text-slate-400 mt-1">{children}</p>
    </div>
  </div>
);

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl border border-slate-700 flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-700 flex-shrink-0">
          <h2 className="text-xl font-bold text-white">How This Chatbot Works</h2>
          <p className="text-sm text-slate-400 mt-1">
            This app uses a simulated Retrieval-Augmented Generation (RAG) process to answer questions based on your documents.
          </p>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          <Step icon={<ScissorsIcon className="w-6 h-6 text-sky-400" />} title="1. Processing & Chunking">
            When you upload a document, it's read and split into smaller, overlapping text chunks. This helps in pinpointing relevant information later.
          </Step>
          <Step icon={<CubeTransparentIcon className="w-6 h-6 text-sky-400" />} title="2. Simulated Embedding">
            <>
              In a full RAG system, each chunk is converted into a numerical vector ('embedding') that captures its meaning.
              <br />
              <em className="text-xs text-slate-500">
                (Note: This app **simulates** this step with a keyword-based search, as running a true embedding model in the browser is resource-intensive.)
              </em>
            </>
          </Step>
          <Step icon={<MagnifyingGlassIcon className="w-6 h-6 text-sky-400" />} title="3. Keyword-Based Retrieval">
            When you ask a question, the app searches all text chunks for the keywords in your query. The chunks with the highest keyword relevance are selected as context.
          </Step>
          <Step icon={<BotIcon className="w-6 h-6 text-sky-400" />} title="4. Augmented Generation">
            The most relevant text chunks (the 'context') are combined with your original question and sent to the AI, which then generates an answer based on that information.
          </Step>
        </div>

        <div className="px-6 py-4 bg-slate-900/50 flex justify-end space-x-3 rounded-b-xl border-t border-slate-700 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold bg-sky-600 rounded-lg hover:bg-sky-500 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};