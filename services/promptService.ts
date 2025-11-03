import { Chunk, ChatMessage } from '../types';

const SYSTEM_PROMPT = `You are a helpful AI assistant. You must answer the user's question based *only* on the provided "CONTEXT FROM DOCUMENTS" and the "CHAT HISTORY".

- First, review the "CHAT HISTORY" to understand the conversation.
- Then, review the "CONTEXT FROM DOCUMENTS" to find relevant information for the current question.
- Synthesize an answer that is conversational and directly addresses the "CURRENT USER QUESTION".
- If the documents do not contain the answer, clearly state that the information is not in the provided documents. Do not use external knowledge.`;

function formatChatHistory(history: ChatMessage[]): string {
  if (!history || history.length === 0) {
    return '[No history yet]';
  }
  return history
    .map(msg => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}`)
    .join('\n');
}

export function buildPrompt(query: string, contextChunks: Chunk[], chatHistory: ChatMessage[]): string {

  const context = contextChunks.length > 0
    ? contextChunks.map(chunk => chunk.content).join('\n---\n')
    : '[No relevant information found in documents]';

  const history = formatChatHistory(chatHistory);

  return `
${SYSTEM_PROMPT}

CHAT HISTORY:
${history}

CONTEXT FROM DOCUMENTS:
${context}

CURRENT USER QUESTION:
${query}
`;
}