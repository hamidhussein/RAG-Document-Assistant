import React, { useState, useCallback } from 'react';
import { ChatWindow } from './components/ChatWindow';
import { FileManager } from './components/FileManager';
import { SettingsModal } from './components/SettingsModal';
import { useDocumentStore } from './hooks/useDocumentStore';
import { useSettings } from './hooks/useSettings';
import { ChatMessage } from './types';
import { generateContextualPrompt } from './services/promptService';
import { searchSimilarChunks } from './services/vectorService';
import { SettingsIcon } from './components/Icons';
import * as llmService from './services/llmService';

const App: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const {
    documents,
    addDocument,
    updateDocument,
    deleteDocument,
  } = useDocumentStore();
  
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isResponding, setIsResponding] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const handleAddDocument = useCallback((file: File) => {
    addDocument(file, settings);
  }, [addDocument, settings]);

  const handleSendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = { sender: 'user', text: message };
    setChatHistory(prev => [...prev, userMessage]);
    setIsResponding(true);

    try {
      if (!settings.apiKey) {
        throw new Error("API key is not configured. Please add it in the settings.");
      }

      const allChunks = documents.flatMap(doc => doc.chunks || []);
      
      if (allChunks.length === 0) {
        const botMessage: ChatMessage = { sender: 'bot', text: "Please upload a document so I can answer your questions about it." };
        setChatHistory(prev => [...prev, botMessage]);
        return;
      }

      const relevantChunks = await searchSimilarChunks(message, allChunks, 3);
      const prompt = generateContextualPrompt(message, relevantChunks);
      
      const botText = await llmService.generateResponse(prompt, settings);

      const botMessage: ChatMessage = { sender: 'bot', text: botText };
      setChatHistory(prev => [...prev, botMessage]);

    } catch (error: any) {
      console.error("Error generating content:", error);
      const errorMessage: ChatMessage = {
        sender: 'bot',
        text: `Sorry, I encountered an error: ${error.message || 'Please check the console for details.'}`,
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsResponding(false);
    }
  }, [settings, documents]);

  const handleNewChat = useCallback(() => {
    setChatHistory([]);
  }, []);

  return (
    <>
      <div className="flex h-screen font-sans bg-slate-900 text-slate-100">
        <FileManager
          documents={documents}
          onAddDocument={handleAddDocument}
          onUpdateDocument={updateDocument}
          onDeleteDocument={deleteDocument}
          onNewChat={handleNewChat}
        />
        <main className="flex-1 flex flex-col h-screen">
          <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-sky-400">Multi-LLM RAG Chatbot</h1>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsSettingsModalOpen(true)}
                className="p-2 text-sm font-semibold bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
                aria-label="Settings"
              >
                <SettingsIcon className="w-5 h-5" />
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
      <SettingsModal 
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onSave={updateSettings}
        initialSettings={settings}
      />
    </>
  );
};

export default App;