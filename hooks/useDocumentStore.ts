import { useState, useEffect, useCallback } from 'react';
import { Document } from '../types';
import { processDocument } from '../services/documentProcessor';
import { AppSettings } from '../types';

const LOCAL_STORAGE_KEY = 'rag_documents';

export const useDocumentStore = () => {
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    try {
      const storedDocs = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedDocs) {
        setDocuments(JSON.parse(storedDocs));
      }
    } catch (error) {
      console.error("Failed to load documents from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(documents));
    } catch (error) {
      console.error("Failed to save documents to localStorage", error);
    }
  }, [documents]);

  const addDocument = useCallback(async (file: File, settings: AppSettings) => {
    const newDoc: Document = {
      id: `doc_${Date.now()}`,
      name: file.name,
      type: file.type === 'application/pdf' ? 'pdf' : 'txt',
      content: '',
      status: 'processing',
      uploadDate: new Date().toISOString(),
    };

    setDocuments(prev => [...prev, newDoc]);

    try {
      const { content, chunks } = await processDocument(file, newDoc.id, {
        chunkSize: settings.chunkSize,
        chunkOverlap: settings.chunkOverlap,
      });
      updateDocument(newDoc.id, { content, chunks, status: 'processed' });
    } catch (error: any) {
      console.error("Failed to process document:", error);
      updateDocument(newDoc.id, {
        status: 'error',
        errorMessage: error.message || 'Unknown processing error',
      });
    }
  }, []);

  const updateDocument = useCallback((docId: string, updates: Partial<Document>) => {
    setDocuments(prev =>
      prev.map(doc => (doc.id === docId ? { ...doc, ...updates } : doc))
    );
  }, []);

  const deleteDocument = useCallback((docId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== docId));
  }, []);
  
  return { documents, addDocument, updateDocument, deleteDocument };
};
