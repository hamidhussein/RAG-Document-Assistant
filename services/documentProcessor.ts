import { Chunk } from '../types';
import { generateEmbedding } from './vectorService';

// Since we're loading PDF.js from a CDN, we need to declare the global variable for TypeScript.
declare const pdfjsLib: any;

interface ChunkConfig {
  chunkSize: number;
  chunkOverlap: number;
}

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

function chunkText(text: string, chunkSize: number, chunkOverlap: number): string[] {
  const chunks: string[] = [];
  if (chunkSize <= chunkOverlap) {
    console.error("Chunk size must be greater than chunk overlap.");
    return [text]; // Return the whole text as a single chunk on error
  }

  let i = 0;
  while (i < text.length) {
    const end = Math.min(i + chunkSize, text.length);
    chunks.push(text.slice(i, end));
    const nextStart = i + chunkSize - chunkOverlap;
    
    // If the next start is the same as current, it will cause an infinite loop.
    // This happens if chunksize is small and overlap is large.
    if (nextStart <= i) {
        i = end;
        if (i >= text.length) break;
        continue;
    }
    
    i = nextStart;

    // A small optimization to not create a tiny chunk at the end
    if (text.length - i < chunkOverlap && i < text.length) {
      chunks.push(text.slice(i));
      break;
    }
  }
  return chunks.filter(c => c.trim().length > 0);
}

export async function processDocument(
  file: File, 
  documentId: string, 
  settings: ChunkConfig
): Promise<{ content: string; chunks: Chunk[] }> {
  const content = await extractTextFromFile(file);
  const textChunks = chunkText(content, settings.chunkSize, settings.chunkOverlap);
  
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
