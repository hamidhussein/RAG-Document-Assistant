
import React, { useRef, useState, useCallback } from 'react';
import { Document } from '../types';
import { FileItem } from './FileItem';
import { UploadIcon } from './Icons';

interface FileManagerProps {
  documents: Document[];
  onAddDocument: (file: File) => void;
  onUpdateDocument: (docId: string, updates: Partial<Document>) => void;
  onDeleteDocument: (docId: string) => void;
}

export const FileManager: React.FC<FileManagerProps> = ({
  documents,
  onAddDocument,
  onUpdateDocument,
  onDeleteDocument,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (files: FileList | null) => {
    if (files) {
      Array.from(files).forEach(file => {
        if (file.type === 'application/pdf' || file.type === 'text/plain') {
          onAddDocument(file);
        } else {
          // You could show an error toast here
          console.warn(`Unsupported file type: ${file.type}`);
        }
      });
    }
  };

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  
  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  return (
    <aside className="w-80 bg-slate-800 flex flex-col h-full border-r border-slate-700">
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-lg font-semibold text-white">My Documents</h2>
        <p className="text-xs text-slate-400">Upload PDFs or TXT files to chat with.</p>
      </div>
      <div 
        className="flex-1 overflow-y-auto p-2"
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragging ? 'border-sky-500 bg-sky-900/50' : 'border-slate-600 hover:border-sky-500 hover:bg-slate-700/50'}`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
            accept=".pdf,.txt"
            multiple
          />
          <UploadIcon className="w-8 h-8 text-slate-400 mb-2" />
          <p className="text-sm text-slate-300">
            <span className="font-semibold text-sky-400">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-slate-500">PDF or TXT files</p>
        </div>
        <div className="mt-4 space-y-2">
          {documents.length > 0 ? (
            documents.map(doc => (
              <FileItem
                key={doc.id}
                document={doc}
                onDelete={onDeleteDocument}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-slate-500">No documents uploaded yet.</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
