
import React from 'react';
import { Document } from '../types';
import { PdfIcon, TxtIcon, TrashIcon, CheckCircleIcon, ExclamationTriangleIcon } from './Icons';
import { Spinner } from './Spinner';

interface FileItemProps {
  document: Document;
  onDelete: (docId: string) => void;
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

export const FileItem: React.FC<FileItemProps> = ({ document, onDelete }) => {
  return (
    <div className="bg-slate-700/50 rounded-lg p-3 flex items-center justify-between group transition-colors hover:bg-slate-700">
      <div className="flex items-center space-x-3 overflow-hidden">
        {document.type === 'pdf' ? <PdfIcon className="w-6 h-6 flex-shrink-0" /> : <TxtIcon className="w-6 h-6 flex-shrink-0" />}
        <div className="flex flex-col overflow-hidden">
          <p className="text-sm font-medium text-slate-200 truncate" title={document.name}>
            {document.name}
          </p>
          <div className="flex items-center space-x-2">
             <StatusIndicator status={document.status} errorMessage={document.errorMessage} />
             <span className="text-xs text-slate-400 capitalize">{document.status}</span>
          </div>
        </div>
      </div>
      <button
        onClick={() => onDelete(document.id)}
        className="p-1 rounded-md text-slate-500 hover:text-red-400 hover:bg-slate-600 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500"
        aria-label={`Delete ${document.name}`}
      >
        <TrashIcon className="w-4 h-4" />
      </button>
    </div>
  );
};
