import { Chunk, AppSettings } from '../types';
import { generateBatchEmbeddings } from './embeddingService';

// Since we're loading PDF.js from a CDN, we need to declare the global variable for TypeScript.
declare const pdfjsLib: any;

async function extractTextFromFile(file: File): Promise<string> {
  if (file.type === 'application/pdf') {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      // Join single-character strings and add spaces appropriately.
      text += content.items.map((item: any) => item.str).join(' ').replace(/\s+/g, ' ').trim();
      text += '\n'; // Add newline after each page
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

async function chunkText(
  text: string,
  documentId: string,
  chunkSize: number,
  chunkOverlap: number
): Promise<Chunk[]> {
  const chunks: Chunk[] = [];
  let index = 0;
  let chunkIndex = 0;

  while (index < text.length) {
    const start = index;
    const end = Math.min(index + chunkSize, text.length);
    const content = text.slice(start, end);

    chunks.push({
      id: `${documentId}_chunk_${chunkIndex++}`,
      documentId,
      content,
    });

    index += chunkSize - chunkOverlap;
    if (index >= text.length) break; // prevent infinite loops on zero/negative overlap
  }

  return chunks;
}


export async function processDocument(
  file: File, 
  documentId: string, 
  settings: Pick<AppSettings, 'chunkSize' | 'chunkOverlap' | 'retrievalMode'>,
  skipExtraction: boolean = false
): Promise<{ content: string; chunks: Chunk[] }> {
  // If we skip extraction, it means the File object was created from raw text we already have.
  const content = skipExtraction ? await file.text() : await extractTextFromFile(file);
  
  const chunksWithoutEmbeddings = await chunkText(
    content,
    documentId,
    settings.chunkSize,
    settings.chunkOverlap
  );

  if (settings.retrievalMode === 'semantic') {
    const chunkContents = chunksWithoutEmbeddings.map(chunk => chunk.content);
    const embeddings = await generateBatchEmbeddings(chunkContents);
    
    const chunksWithEmbeddings = chunksWithoutEmbeddings.map((chunk, i) => ({
        ...chunk,
        embedding: embeddings[i],
    }));

    return { content, chunks: chunksWithEmbeddings };
  }


  return { content, chunks: chunksWithoutEmbeddings };
}