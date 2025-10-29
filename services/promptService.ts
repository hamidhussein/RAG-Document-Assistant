
import { Chunk } from '../types';

export const generateContextualPrompt = (query: string, contextChunks: Chunk[]): string => {
  const context = contextChunks
    .map(chunk => chunk.text)
    .join('\n---\n');

  return `You are an expert AI assistant. Your task is to answer the user's question based *only* on the provided context.
If the context does not contain the information needed to answer the question, you must state that you cannot answer based on the provided documents.
Do not use any external knowledge. Be concise and accurate.

CONTEXT:
\`\`\`
${context}
\`\`\`

USER QUESTION:
${query}
`;
};
