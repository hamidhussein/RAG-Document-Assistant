# Multi-LLM RAG Chatbot

This project is a sophisticated, client-side Retrieval-Augmented Generation (RAG) chatbot built with React, TypeScript, and a flexible backend supporting multiple Large Language Models, including the Google Gemini API. It allows users to upload their own documents (PDFs or text files) and engage in a conversation where the AI's responses are grounded in the content of those documents.

The entire application runs in the browser, ensuring user data privacy and eliminating the need for a complex server-side setup.

## Key Features

- **Multi-LLM Support:**
  - **Flexible Backend:** Seamlessly switch between different AI providers (Google Gemini, Llama, OpenAI, Anthropic Claude) via the settings menu.
  - **Scalable Architecture:** A dedicated service layer makes it easy to integrate new LLMs in the future.

- **Centralized Settings & Actions:**
  - A comprehensive settings modal serves as the control hub for API configuration, chat management ("New Chat", "Clear Chat"), and document processing (chunk size, overlap).

- **Complete Document Management (CRUD):**
  - **Upload:** Easily upload multiple PDF or `.txt` files via a file picker or drag-and-drop.
  - **View & Status Tracking:** A clean sidebar lists all uploaded documents with real-time status indicators (Processing, Processed, Error).
  - **Delete:** Remove documents and their associated data with a single click.

- **Advanced RAG Pipeline (Client-Side):**
  - **Document Processing:** Automatically extracts text from files and splits it into smaller, overlapping chunks for precise information retrieval.
  - **Simulated Vector Embeddings:** Converts text chunks into numerical vectors to enable semantic search. *(See "A Note on Embeddings" below)*.
  - **Semantic Search:** Performs a cosine similarity search to find the most contextually relevant document chunks for a given query.
  - **Context-Aware Prompting:** The retrieved chunks are dynamically injected into the prompt, instructing the LLM to answer based *only* on the provided information.

- **Polished User Experience:**
  - **Interactive Chat Interface:** An intuitive and clean chat window.
  - **Persistence:** All documents and settings are saved to the browser's `localStorage`, so your files and configuration are available across sessions.
  - **Asynchronous Operations:** File processing and AI responses happen in the background without freezing the UI, with clear loading indicators.
  - **Responsive Design:** Built with Tailwind CSS for a seamless experience on any screen size.

## Technology Stack

- **Frontend:** React, TypeScript, Tailwind CSS
- **AI Models:**
  - **Google Gemini API (`@google/genai`):** Fully integrated support for models like `gemini-2.5-flash`.
  - **Meta Llama 3:** Fully integrated via the [Groq API](https://groq.com/) for high-speed inference.
  - **OpenAI & Anthropic Claude:** Architecture in place for easy integration (currently placeholder).
- **Document Parsing:** [PDF.js](https://mozilla.github.io/pdf.js/) by Mozilla, loaded via CDN to process PDFs directly in the browser.
- **Browser APIs:**
  - `localStorage`: For data and settings persistence.
  - `FileReader API` & `Drag and Drop API`: For a modern file upload experience.

## How the RAG Pipeline Works

1.  **Ingestion & Processing:** When a file is uploaded, its raw text is extracted.
2.  **Chunking:** The text is divided into manageable chunks based on configurable size and overlap settings.
3.  **Embedding (Simulated):** Each text chunk is converted into a numerical vector representing its semantic meaning.
4.  **Storage:** Document metadata, text chunks, and their embeddings are stored in `localStorage`.
5.  **Retrieval:** When you ask a question:
    - Your query is also converted into an embedding.
    - The application calculates the cosine similarity between your query's embedding and all stored document chunk embeddings.
    - The most relevant chunks are retrieved.
6.  **Generation:** The retrieved chunks are combined with your original question into a carefully crafted prompt. This prompt is sent to your selected LLM (e.g., Gemini) via the abstracted `llmService` to generate a final, contextually grounded answer.

---

### A Note on Embeddings

As of the current implementation, the `@google/genai` client-side SDK does not provide a dedicated endpoint for generating text embeddings. To build a complete and correct RAG architecture, this project **simulates the embedding process**.

The `services/vectorService.ts` file contains a `generateEmbedding` function that creates a random, normalized vector for a given piece of text. While these vectors are not semantically meaningful, they allow the entire pipeline—from chunking to similarity search and retrieval—to be fully functional and structurally accurate. This simulated step can be easily replaced with a call to a real embedding model API (like `text-embedding-004`) once it becomes available on the client-side SDK or if the project is adapted to include a server-side component.