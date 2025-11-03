import React, { useState, useCallback, useEffect } from 'react';
import { ChatWindow } from './components/ChatWindow';
import { FileManager } from './components/FileManager';
import { SettingsModal } from './components/SettingsModal';
import { HowItWorksModal } from './components/HowItWorksModal';
import { useDocumentStore } from './hooks/useDocumentStore';
import { useSettings } from './hooks/useSettings';
import { ChatMessage, Chunk, Document } from './types';
import * as vectorService from './services/vectorService';
import * as promptService from './services/promptService';
import * as llmService from './services/llmService';
import { SettingsIcon } from './components/Icons';

const App: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const {
    documents,
    addDocument,
    updateDocument,
    deleteDocument,
    reprocessDocument,
    exportData,
    importData,
  } = useDocumentStore();
  
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isResponding, setIsResponding] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isHowItWorksModalOpen, setIsHowItWorksModalOpen] = useState(false);
  const [allChunks, setAllChunks] = useState<Chunk[]>([]);

  // Effect to update the global chunk list whenever documents change
  useEffect(() => {
    const processedDocs = documents.filter(doc => doc.status === 'processed' && doc.processedChunks);
    const newAllChunks = processedDocs.flatMap(doc => doc.processedChunks!);
    setAllChunks(newAllChunks);
  }, [documents]);
  
  const handleAddDocument = useCallback((file: File) => {
    addDocument(file, settings);
  }, [addDocument, settings]);

  const handleDeleteDocument = useCallback(async (docId: string) => {
    deleteDocument(docId);
  }, [deleteDocument]);
  
  const handleReprocessDocument = useCallback(async (docId: string) => {
    reprocessDocument(docId, settings);
  }, [reprocessDocument, settings]);

  const handleImportData = useCallback(async (file: File) => {
    if (file) {
      if (window.confirm('Importing will replace all current documents. Are you sure?')) {
        importData(file);
        handleNewChat(); // Clear chat after import
      }
    }
  }, [importData]);


  const handleSendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    // Pre-flight check: Ensure API key is set before proceeding.
    if (!settings.apiKey) {
      setIsSettingsModalOpen(true);
      return;
    }

    const userMessage: ChatMessage = { sender: 'user', text: message };
    setChatHistory(prev => [...prev, userMessage]);
    setIsResponding(true);

    try {
      if (allChunks.length === 0) {
        const botMessage: ChatMessage = { sender: 'bot', text: "Please upload a document so I can answer your questions about it. The document may still be processing." };
        setChatHistory(prev => [...prev, botMessage]);
        return;
      }

      const contextChunks = await vectorService.searchSimilarChunks(message, allChunks, settings.retrievalMode, 5);
      // Pass the last 5 messages for conversational context
      const conversationHistory = chatHistory.slice(-5);
      const prompt = promptService.buildPrompt(message, contextChunks, conversationHistory);
      const botText = await llmService.generateContent(prompt, settings);

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
  }, [settings, allChunks, chatHistory]);

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
          onDeleteDocument={handleDeleteDocument}
          onNewChat={handleNewChat}
          onOpenHowItWorks={() => setIsHowItWorksModalOpen(true)}
          onReprocessDocument={handleReprocessDocument}
          onExportData={exportData}
          onImportData={handleImportData}
        />
        <main className="flex-1 flex flex-col h-screen">
          <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-sky-400">Client-Side RAG Chatbot</h1>
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
      <HowItWorksModal
        isOpen={isHowItWorksModalOpen}
        onClose={() => setIsHowItWorksModalOpen(false)}
      />
    </>
  );
};

export default App;