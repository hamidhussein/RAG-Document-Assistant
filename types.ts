export type DocumentStatus = 'processing' | 'processed' | 'error';

export type RetrievalMode = 'tfidf' | 'semantic';

export interface Chunk {
  id: string;
  documentId: string;
  content: string;
  embedding?: number[];
}

export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'txt';
  content: string;
  status: DocumentStatus;
  processedChunks?: Chunk[];
  uploadDate: string;
  errorMessage?: string;
  hash?: string;
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
  retrievalMode: RetrievalMode;
}