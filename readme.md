# 100% Client-Side RAG Chatbot

This project is a sophisticated, 100% client-side Retrieval-Augmented Generation (RAG) chatbot built with React and TypeScript. It supports multiple Large Language Models (including Google Gemini) and allows users to upload their own documents (PDFs or text files) to create a powerful, private, and context-aware chat experience.

The entire application—from document parsing and chunking to the final LLM generation—runs in the browser, ensuring user data privacy and eliminating the need for a server-side backend.

## Key Features

- **Multi-LLM Support:** Seamlessly switch between different AI providers (Google Gemini, Llama, OpenAI, Anthropic Claude) via the settings menu.
- **Dual Retrieval Modes:** Choose your retrieval strategy:
  - **TF-IDF (Fast):** A quick and efficient keyword-based search.
  - **Semantic (Accurate):** A more advanced search that understands the meaning behind your query, powered by an in-browser transformer model.
- **Robust Persistence with IndexedDB:** All documents are stored in the browser's IndexedDB, allowing for larger files and more persistent storage than standard `localStorage`.
- **Advanced Document Management (CRUD):**
  - **Upload with Duplicate Detection:** Upload multiple PDF or `.txt` files. The app hashes each file to prevent processing the same document twice.
  - **View, Rename, Reprocess, Delete:** A clean sidebar lists all documents with real-time status indicators. You can rename files inline, re-process them with new settings, or delete them.
- **Data Portability:**
  - **Export/Import:** Easily export your entire document library to a JSON file and import it into another browser, making your knowledge base portable.
- **Conversational Memory:** The chatbot remembers the last few turns of the conversation to understand follow-up questions and provide more contextual responses.
- **100% Client-Side RAG Pipeline:**
  - **In-Browser Processing:** All document parsing, text chunking, and embedding generation happens directly on the client.
- **Polished User Experience:**
  - **Interactive Chat Interface:** An intuitive and clean chat window.
  - **Asynchronous Operations:** File processing and AI responses happen in the background with clear loading indicators.
  - **Responsive Design:** Built with Tailwind CSS for a seamless experience on any screen size.

## Technology Stack

- **Frontend:** React, TypeScript, Tailwind CSS
- **LLM Interaction:** `@google/genai` SDK, `fetch` API for other providers.
- **Semantic Search:** [Transformers.js](https://github.com/xenova/transformers.js) by Xenova.
- **Document Parsing:** [PDF.js](https://mozilla.github.io/pdf.js/) by Mozilla.
- **Client-Side Storage:** [localForage](https://github.com/localForage/localForage) (for a simple IndexedDB API).
- **Browser APIs:** `Web Crypto API` (for hashing), `localStorage` (for settings), `FileReader`, Drag and Drop.

## How the RAG Pipeline Works

1.  **Ingestion & Hashing:** When a file is uploaded, a unique hash is generated from its content to prevent duplicates. Its raw text is extracted using PDF.js or the FileReader API.
2.  **Chunking:** The text is divided into smaller, manageable, overlapping chunks.
3.  **Embedding (Conditional):** If "Semantic" mode is enabled, the app uses Transformers.js to convert each chunk into a vector embedding directly in the browser. These embeddings are stored in IndexedDB.
4.  **Storage:** The document, its processed chunks, and (if applicable) its embeddings are saved to IndexedDB.
5.  **Retrieval:**
    - **TF-IDF Mode:** When you ask a question, the app uses a TF-IDF algorithm to score and rank all document chunks based on keyword relevance.
    - **Semantic Mode:** The app generates an embedding for your question and uses cosine similarity to find the most semantically similar text chunks from the stored embeddings.
6.  **Generation:**
    - The top-scoring chunks (the context), the recent conversation history, and your original question are combined into a carefully crafted prompt.
    - This prompt is sent to the selected LLM (e.g., Gemini).
    - The model generates a final, contextually grounded answer, which is displayed in the UI.