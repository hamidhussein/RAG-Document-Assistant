import { pipeline, env } from '@xenova/transformers';

// Skip local model check and use cache for faster model loading
env.allowLocalModels = false;
env.useCache = true;

/**
 * Singleton class for managing the feature-extraction pipeline.
 * This ensures that the model is loaded only once.
 */
class EmbeddingPipeline {
  static task = 'feature-extraction';
  static model = 'Xenova/all-MiniLM-L6-v2';
  static instance: any = null;

  static async getInstance(progress_callback?: Function) {
    if (this.instance === null) {
      this.instance = await pipeline(this.task, this.model, { progress_callback });
    }
    return this.instance;
  }
}

/**
 * Generates an embedding for a single piece of text.
 * @param {string} text The text to generate an embedding for.
 * @returns {Promise<number[]>} A promise that resolves to the embedding vector.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const extractor = await EmbeddingPipeline.getInstance();
  const result = await extractor(text, { pooling: 'mean', normalize: true });
  return Array.from(result.data);
}

/**
 * Generates embeddings for a batch of texts.
 * @param {string[]} texts An array of texts to generate embeddings for.
 * @returns {Promise<number[][]>} A promise that resolves to a nested array of embedding vectors.
 */
export async function generateBatchEmbeddings(texts: string[]): Promise<number[][]> {
    const extractor = await EmbeddingPipeline.getInstance();
    // The `pipeline` function can handle arrays of strings directly.
    const results = await extractor(texts, { pooling: 'mean', normalize: true });
    // Convert the Tensor into a nested array
    return results.tolist();
}