
import React, { useState, useCallback, useMemo } from 'react';
import { ChatWindow } from './components/ChatWindow';
import { FileManager } from './components/FileManager';
import { useDocumentStore } from './hooks/useDocumentStore';
import { ChatMessage, Document } from './types';
import { generateContextualPrompt } from './services/promptService';
import { GoogleGenAI } from '@google/genai';
import { searchSimilarChunks } from './services/vectorService';

const App: React.FC = () => {
  const {
    documents,
    addDocument,
    updateDocument,
    deleteDocument,
  } = useDocumentStore();
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isResponding, setIsResponding] = useState(false);

  // Memoize the Gemini AI instance
  const ai = useMemo(() => {
    if (!process.env.API_KEY) {
      // In a real app, you'd handle this more gracefully.
      // For this environment, we assume the key is present.
      console.error("API_KEY environment variable not set.");
      return null;
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }, []);

  const handleSendMessage = useCallback(async (message: string) => {
    if (!message.trim() || !ai) return;

    const userMessage: ChatMessage = { sender: 'user', text: message };
    setChatHistory(prev => [...prev, userMessage]);
    setIsResponding(true);

    try {
      const allChunks = documents.flatMap(doc => doc.chunks || []);
      
      if (allChunks.length === 0) {
        const botMessage: ChatMessage = { sender: 'bot', text: "Please upload a document so I can answer your questions about it." };
        setChatHistory(prev => [...prev, botMessage]);
        setIsResponding(false);
        return;
      }

      const relevantChunks = await searchSimilarChunks(message, allChunks, 3);
      const prompt = generateContextualPrompt(message, relevantChunks);
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const botMessage: ChatMessage = { sender: 'bot', text: response.text };
      setChatHistory(prev => [...prev, botMessage]);

    } catch (error) {
      console.error("Error generating content:", error);
      const errorMessage: ChatMessage = {
        sender: 'bot',
        text: 'Sorry, I encountered an error while processing your request. Please check the console for details.',
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsResponding(false);
    }
  }, [ai, documents]);

  const handleNewChat = useCallback(() => {
    setChatHistory([]);
  }, []);

  return (
    <div className="flex h-screen font-sans bg-slate-900 text-slate-100">
      <FileManager
        documents={documents}
        onAddDocument={addDocument}
        onUpdateDocument={updateDocument}
        onDeleteDocument={deleteDocument}
      />
      <main className="flex-1 flex flex-col h-screen">
        <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-sky-400">Gemini RAG Chatbot</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleNewChat}
              className="px-4 py-2 text-sm font-semibold bg-sky-600 rounded-lg hover:bg-sky-500 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
              New Chat
            </button>
            <button
              onClick={handleNewChat}
              className="px-4 py-2 text-sm font-semibold bg-red-600 rounded-lg hover:bg-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              Clear Chat
            </button>
          </div>
        </header>
        <ChatWindow
          chatHistory={chatHistory}
          onSendMessage={handleSendMessage}
          isResponding={isResponding}
        />
      </main>
    </div>
  );
};

export default App;
