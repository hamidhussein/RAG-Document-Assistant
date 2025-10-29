
export interface Chunk {
  id: string;
  documentId: string;
  text: string;
  embedding: number[]; // Simulated embedding
}

export type DocumentStatus = 'processing' | 'processed' | 'error';

export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'txt';
  content: string;
  status: DocumentStatus;
  chunks?: Chunk[];
  uploadDate: string;
  errorMessage?: string;
}

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}
