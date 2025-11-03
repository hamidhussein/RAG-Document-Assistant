import { Chunk, RetrievalMode } from '../types';
import { generateEmbedding } from './embeddingService';

// Simple stop words list
const STOP_WORDS = new Set(['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now']);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/\s+/)
    .map(word => word.replace(/[^\w]/g, ''))
    .filter(word => word.length > 1 && !STOP_WORDS.has(word));
}


// --- Helper for Semantic Search ---
function cosineSimilarity(vecA: number[], vecB: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function semanticSearch(query: string, allChunks: Chunk[], topK: number): Promise<Chunk[]> {
    if (allChunks.length === 0) return [];
    
    const queryEmbedding = await generateEmbedding(query);
    
    const chunksWithEmbeddings = allChunks.filter(chunk => chunk.embedding && chunk.embedding.length > 0);
    if (chunksWithEmbeddings.length === 0) {
        console.warn("Semantic search was requested, but no chunks have embeddings. Reprocess documents with semantic mode enabled.");
        return [];
    }

    const chunkScores = chunksWithEmbeddings.map(chunk => ({
        chunk,
        score: cosineSimilarity(queryEmbedding, chunk.embedding!),
    }));

    return chunkScores
        .sort((a, b) => b.score - a.score)
        .slice(0, topK)
        .map(item => item.chunk);
}

async function tfidfSearch(query: string, allChunks: Chunk[], topK: number): Promise<Chunk[]> {
    const queryKeywords = tokenize(query);
    const totalDocuments = allChunks.length;

    if (queryKeywords.length === 0 || totalDocuments === 0) {
        return allChunks.slice(0, topK);
    }
    
    const idfCache = new Map<string, number>();
    queryKeywords.forEach(keyword => {
        const docsWithTerm = allChunks.filter(chunk => chunk.content.toLowerCase().includes(keyword)).length;
        const idf = Math.log(totalDocuments / (1 + docsWithTerm));
        idfCache.set(keyword, idf);
    });

    const chunkScores = allChunks.map(chunk => {
        const chunkWords = chunk.content.toLowerCase().split(/\s+/);
        const totalWordsInChunk = chunkWords.length;
        let score = 0;

        if (totalWordsInChunk > 0) {
            queryKeywords.forEach(keyword => {
                const termFrequencyInChunk = chunkWords.filter(word => word === keyword).length;
                const tf = termFrequencyInChunk / totalWordsInChunk;
                const idf = idfCache.get(keyword) || 0;
                score += tf * idf;
            });
        }
        return { chunk, score };
    });

    const sortedChunks = chunkScores
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score);

    if (sortedChunks.length === 0) {
        return allChunks.slice(0, topK);
    }

    return sortedChunks.slice(0, topK).map(item => item.chunk);
}

export async function searchSimilarChunks(
    query: string, 
    allChunks: Chunk[], 
    retrievalMode: RetrievalMode, 
    topK = 5
): Promise<Chunk[]> {
    if (retrievalMode === 'semantic') {
        return semanticSearch(query, allChunks, topK);
    }
    return tfidfSearch(query, allChunks, topK);
}