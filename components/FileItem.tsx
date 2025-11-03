import React, { useState } from 'react';
import { Document } from '../types';
import { PdfIcon, TxtIcon, TrashIcon, CheckCircleIcon, ExclamationTriangleIcon, PencilIcon, ArrowPathIcon } from './Icons';
import { Spinner } from './Spinner';

interface FileItemProps {
  document: Document;
  onDelete: (docId: string) => void;
  onRename: (docId: string, newName: string) => void;
  onReprocess: (docId: string) => void;
}

const StatusIndicator: React.FC<{ status: Document['status'], errorMessage?: string }> = ({ status, errorMessage }) => {
    switch (status) {
        case 'processing':
            return <Spinner className="w-4 h-4 text-sky-400" />;
        case 'processed':
            return <CheckCircleIcon className="w-4 h-4 text-green-400" />;
        case 'error':
            return <div title={errorMessage}><ExclamationTriangleIcon className="w-4 h-4 text-red-400" /></div>;
        default:
            return null;
    }
}

export const FileItem: React.FC<FileItemProps> = ({ document, onDelete, onRename, onReprocess }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(document.name);

  const handleRename = () => {
    if (name.trim() && name !== document.name) {
      onRename(document.id, name.trim());
    } else {
      setName(document.name); // Revert if empty or unchanged
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setName(document.name);
      setIsEditing(false);
    }
  };

  return (
    <div className="bg-slate-700/50 rounded-lg p-3 flex items-center justify-between group transition-colors hover:bg-slate-700">
      <div className="flex items-center space-x-3 overflow-hidden flex-1">
        {document.type === 'pdf' ? <PdfIcon className="w-6 h-6 flex-shrink-0" /> : <TxtIcon className="w-6 h-6 flex-shrink-0" />}
        <div className="flex flex-col overflow-hidden">
          {isEditing ? (
             <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={handleKeyDown}
              className="text-sm font-medium bg-slate-800 text-slate-100 rounded px-1 -ml-1 focus:outline-none focus:ring-1 focus:ring-sky-500"
              autoFocus
            />
          ) : (
            <p className="text-sm font-medium text-slate-200 truncate" title={document.name}>
              {document.name}
            </p>
          )}
          <div className="flex items-center space-x-2">
             <StatusIndicator status={document.status} errorMessage={document.errorMessage} />
             <span className="text-xs text-slate-400 capitalize">{document.status}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-1 flex-shrink-0">
        <button
          onClick={() => onReprocess(document.id)}
          className="p-1 rounded-md text-slate-500 hover:text-sky-400 hover:bg-slate-600 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
          aria-label={`Reprocess ${document.name}`}
          title="Reprocess document (applies new settings)"
        >
          <ArrowPathIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => setIsEditing(true)}
          className="p-1 rounded-md text-slate-500 hover:text-sky-400 hover:bg-slate-600 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
          aria-label={`Rename ${document.name}`}
          title="Rename document"
        >
          <PencilIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(document.id)}
          className="p-1 rounded-md text-slate-500 hover:text-red-400 hover:bg-slate-600 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
          aria-label={`Delete ${document.name}`}
          title="Delete document"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};