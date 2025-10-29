
import { Chunk } from '../types';

const EMBEDDING_DIMENSION = 128; // A smaller, arbitrary dimension for simulation

/**
 * SIMULATED: Generates a random vector to simulate a text embedding.
 * In a real application, this would call a dedicated embedding model API.
 * The Gemini client-side SDK as of this implementation does not provide a direct embedding endpoint.
 * @param text - The text to "embed".
 * @returns A promise that resolves to a random vector.
 */
export const generateEmbedding = async (text: string): Promise<number[]> => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 50));
  
  // Create a random vector. This is a stand-in for a real embedding.
  const vector = Array.from(
    { length: EMBEDDING_DIMENSION },
    () => Math.random() * 2 - 1
  );

  // Normalize the vector (important for cosine similarity)
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  return vector.map(v => v / magnitude);
};

/**
 * Calculates the dot product of two vectors.
 * Since vectors are normalized, this is equivalent to cosine similarity.
 */
const dotProduct = (vecA: number[], vecB: number[]): number => {
  return vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
};

/**
 * Finds the top N most similar chunks to a query text.
 * @param query - The user's query text.
 * @param chunks - The list of all document chunks.
 * @param topN - The number of similar chunks to return.
 * @returns An array of the most relevant chunks.
 */
export const searchSimilarChunks = async (query: string, chunks: Chunk[], topN: number): Promise<Chunk[]> => {
  if (chunks.length === 0) return [];
  
  const queryEmbedding = await generateEmbedding(query);
  
  const scoredChunks = chunks.map(chunk => ({
    chunk,
    similarity: dotProduct(queryEmbedding, chunk.embedding),
  }));
  
  scoredChunks.sort((a, b) => b.similarity - a.similarity);
  
  return scoredChunks.slice(0, topN).map(item => item.chunk);
};
