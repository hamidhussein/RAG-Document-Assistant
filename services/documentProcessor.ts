
import { Chunk } from '../types';
import { generateEmbedding } from './vectorService';

// Since we're loading PDF.js from a CDN, we need to declare the global variable for TypeScript.
declare const pdfjsLib: any;

const CHUNK_SIZE = 800; // tokens ~ 3200 chars
const CHUNK_OVERLAP = 100; // tokens ~ 400 chars

async function extractTextFromFile(file: File): Promise<string> {
  if (file.type === 'application/pdf') {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item: any) => item.str).join(' ');
    }
    return text;
  } else {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  }
}

function chunkText(text: string): string[] {
  const chunks: string[] = [];
  let i = 0;
  while (i < text.length) {
    const end = Math.min(i + CHUNK_SIZE, text.length);
    chunks.push(text.slice(i, end));
    i += CHUNK_SIZE - CHUNK_OVERLAP;
    if (i >= text.length - CHUNK_OVERLAP && end < text.length) {
       chunks.push(text.slice(i));
       break;
    }
  }
  return chunks.filter(c => c.trim().length > 0);
}

export async function processDocument(file: File, documentId: string): Promise<{ content: string; chunks: Chunk[] }> {
  const content = await extractTextFromFile(file);
  const textChunks = chunkText(content);
  
  const chunks: Chunk[] = await Promise.all(
    textChunks.map(async (text, index) => {
      const embedding = await generateEmbedding(text);
      return {
        id: `${documentId}_chunk_${index}`,
        documentId,
        text,
        embedding,
      };
    })
  );

  return { content, chunks };
}
