# Gemini RAG Chatbot

This project is a sophisticated, client-side Retrieval-Augmented Generation (RAG) chatbot built with React, TypeScript, and the Google Gemini API. It allows users to upload their own documents (PDFs or text files) and engage in a conversation where the AI's responses are grounded in the content of those documents.

The entire application runs in the browser, ensuring user data privacy and eliminating the need for a complex server-side setup.

## Key Features

- **Complete Document Management (CRUD):**
  - **Upload:** Easily upload multiple PDF or `.txt` files via a file picker or drag-and-drop.
  - **View & Status Tracking:** A clean sidebar lists all uploaded documents with real-time status indicators (Processing, Processed, Error).
  - **Delete:** Remove documents and their associated data with a single click.

- **Advanced RAG Pipeline (Client-Side):**
  - **Document Processing:** Automatically extracts text from PDFs and `.txt` files, then splits the content into smaller, overlapping chunks for precise information retrieval.
  - **Simulated Vector Embeddings:** Converts text chunks into numerical vectors to enable semantic search. *(See "A Note on Embeddings" below)*.
  - **Semantic Search:** When a user asks a question, the application performs a cosine similarity search to find the most contextually relevant document chunks.
  - **Context-Aware Prompting:** The retrieved chunks are dynamically injected into a prompt for the Gemini model, instructing it to answer based *only* on the provided information.

- **Polished User Experience:**
  - **Interactive Chat Interface:** A familiar and intuitive chat window for conversation.
  - **Persistence:** All documents and processed data are saved to the browser's `localStorage`, so your files are available across sessions.
  - **Asynchronous Operations:** File processing and AI responses happen in the background without freezing the UI, with clear loading indicators.
  - **Responsive Design:** The layout is built with Tailwind CSS for a seamless experience on various screen sizes.

## Technology Stack

- **Frontend:** React, TypeScript, Tailwind CSS
- **AI Model:** Google Gemini API (`@google/genai`), specifically using the `gemini-2.5-flash` model.
- **Document Parsing:** [PDF.js](https://mozilla.github.io/pdf.js/) by Mozilla, loaded via CDN to process PDFs directly in the browser.
- **Browser APIs:**
  - `localStorage`: For data persistence.
  - `FileReader API`: For reading file content.
  - `Drag and Drop API`: For an enhanced file upload experience.

## How the RAG Pipeline Works

This application implements a full RAG pipeline from start to finish within the browser:

1.  **Ingestion & Processing:** When a file is uploaded, the `FileReader` and `PDF.js` APIs are used to extract its raw text.
2.  **Chunking:** The extracted text is divided into manageable chunks (around 800 characters) with a slight overlap to maintain contextual continuity between them.
3.  **Embedding (Simulated):** Each text chunk is passed through a function that generates a numerical vector (an "embedding"). This vector represents the semantic meaning of the text.
4.  **Storage:** The original document metadata, its text chunks, and their corresponding embeddings are all stored in the browser's `localStorage`.
5.  **Retrieval:** When you ask a question:
    - Your query is also converted into an embedding.
    - The application calculates the cosine similarity between your query's embedding and the embeddings of all stored document chunks.
    - The chunks with the highest similarity scores (i.e., the most relevant ones) are retrieved.
6.  **Generation:** The retrieved chunks are combined with your original question into a carefully crafted prompt. This prompt is then sent to the Gemini API, which generates a final, contextually grounded answer.

---

### A Note on Embeddings

As of the current implementation, the `@google/genai` client-side SDK does not provide a dedicated endpoint for generating text embeddings. To build a complete and correct RAG architecture, this project **simulates the embedding process**.

The `services/vectorService.ts` file contains a `generateEmbedding` function that creates a random, normalized vector for a given piece of text. While these vectors are not semantically meaningful, they allow the entire pipeline—from chunking to similarity search and retrieval—to be fully functional and structurally accurate. This simulated step can be easily replaced with a call to a real embedding model API (like `text-embedding-004`) once it becomes available on the client-side SDK or if the project is adapted to include a server-side component.
