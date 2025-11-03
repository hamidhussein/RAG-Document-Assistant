import { useState, useEffect, useCallback } from 'react';
import { Document } from '../types';
import { processDocument } from '../services/documentProcessor';
import { AppSettings } from '../types';

declare const localforage: any;

const DB_KEY = 'rag_documents';

// Helper function to hash a file
async function hashFile(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export const useDocumentStore = () => {
  const [documents, setDocuments] = useState<Document[]>([]);

  // Load documents from IndexedDB on initial mount
  useEffect(() => {
    async function loadDocuments() {
      try {
        const storedDocs: Document[] | null = await localforage.getItem(DB_KEY);
        if (storedDocs) {
          setDocuments(storedDocs);
        }
      } catch (error) {
        console.error("Failed to load documents from IndexedDB", error);
      }
    }
    loadDocuments();
  }, []);

  const persistDocuments = useCallback(async (docs: Document[]) => {
    try {
      await localforage.setItem(DB_KEY, docs);
    } catch (error) {
      console.error("Failed to save documents to IndexedDB", error);
    }
  }, []);

  const addDocument = useCallback(async (file: File, settings: AppSettings) => {
    const fileHash = await hashFile(file);

    if (documents.some(doc => doc.hash === fileHash)) {
      console.warn(`Document "${file.name}" is already uploaded.`);
      alert(`The file "${file.name}" has already been uploaded.`);
      return;
    }

    const newDoc: Document = {
      id: `doc_${Date.now()}`,
      name: file.name,
      type: file.type === 'application/pdf' ? 'pdf' : 'txt',
      content: '', // Content will be populated by processDocument
      status: 'processing',
      uploadDate: new Date().toISOString(),
      hash: fileHash,
    };
    
    // Immediately update state to show the processing document
    const updatedDocsList = [...documents, newDoc];
    setDocuments(updatedDocsList);
    
    try {
      const { content, chunks } = await processDocument(file, newDoc.id, settings);
      updateDocument(newDoc.id, { content, processedChunks: chunks, status: 'processed' });
    } catch (error: any) {
      console.error("Failed to process document:", error);
      updateDocument(newDoc.id, {
        status: 'error',
        errorMessage: error.message || 'Unknown processing error',
      });
    }
  }, [documents]);

  const updateDocument = useCallback((docId: string, updates: Partial<Document>) => {
    setDocuments(prev => {
      const newDocs = prev.map(doc => (doc.id === docId ? { ...doc, ...updates } : doc));
      persistDocuments(newDocs);
      return newDocs;
    });
  }, [persistDocuments]);

  const deleteDocument = useCallback((docId: string) => {
    setDocuments(prev => {
      const newDocs = prev.filter(doc => doc.id !== docId);
      persistDocuments(newDocs);
      return newDocs;
    });
  }, [persistDocuments]);

  const reprocessDocument = useCallback(async (docId: string, settings: AppSettings) => {
    const docToReprocess = documents.find(doc => doc.id === docId);
    if (!docToReprocess) {
      console.error("Document not found for reprocessing.");
      return;
    }
    
    updateDocument(docId, { status: 'processing', errorMessage: undefined });

    try {
      // Re-create a File object from the stored raw text content to re-process.
      const file = new File([docToReprocess.content], docToReprocess.name, { 
        type: docToReprocess.type === 'pdf' ? 'application/pdf' : 'text/plain' 
      });

      const { content, chunks } = await processDocument(
        file,
        docId, 
        settings,
        true // Tell the processor to skip PDF extraction and just use the text.
      );
      updateDocument(docId, { content, processedChunks: chunks, status: 'processed' });
    } catch (error: any) {
      console.error("Failed to re-process document:", error);
      updateDocument(docId, {
        status: 'error',
        errorMessage: error.message || 'Unknown re-processing error',
      });
    }
  }, [documents, updateDocument]);

  const exportData = useCallback(async () => {
    try {
      const data = await localforage.getItem(DB_KEY);
      const jsonString = JSON.stringify(data || [], null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rag-chatbot-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export data:', error);
      alert('Error exporting data. Check the console for details.');
    }
  }, []);

  const importData = useCallback(async (file: File) => {
    try {
      const text = await file.text();
      const importedDocs: Document[] = JSON.parse(text);
      if (Array.isArray(importedDocs) && importedDocs.every(d => d.id && d.name)) {
        setDocuments(importedDocs);
        persistDocuments(importedDocs);
      } else {
        throw new Error('Invalid backup file format.');
      }
    } catch (error) {
      console.error('Failed to import data:', error);
      alert('Error importing data. The file might be corrupted or in the wrong format.');
    }
  }, [persistDocuments]);
  
  return { documents, addDocument, updateDocument, deleteDocument, reprocessDocument, exportData, importData };
};