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

export type ApiProvider = 'gemini' | 'openai' | 'llama' | 'claude';

export interface AppSettings {
  apiProvider: ApiProvider;
  apiKey: string;
  chunkSize: number;
  chunkOverlap: number;
}