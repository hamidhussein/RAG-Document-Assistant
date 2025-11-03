# KnowledgeMate – Your Private Document Assistant

*A 100% client-side RAG chatbot to chat with your documents privately and securely.*

KnowledgeMate is a powerful, privacy-first personal assistant for your documents. It's a Retrieval-Augmented Generation (RAG) chatbot that runs entirely in your web browser. You can upload your PDF or text files and ask questions about them using leading AI models like Google Gemini, without your sensitive data ever leaving your computer.

This project is built for anyone who needs to quickly find information in their documents—researchers, students, and professionals—without compromising on privacy.

## 🚀 Key Features

- **🔒 100% Private & Secure:** All document processing and AI interactions happen in your browser. Your files are never uploaded to a server.
- **🧠 Multi-LLM Support:** Seamlessly switch between Google Gemini, OpenAI (GPT-4o-mini), Llama 3 (via Groq), and Anthropic Claude.
- **🔍 Dual Retrieval Modes:**
  - **TF-IDF (Fast):** A rapid, keyword-based search for quick lookups.
  - **Semantic (Accurate):** An advanced search that understands the *meaning* of your query, powered by an in-browser transformer model.
- **📚 Full Document Control (CRUD):**
  - **Persistent Storage:** Uses IndexedDB to store your documents, so they're always there when you return.
  - **Duplicate Detection:** Automatically prevents you from uploading the same file twice.
  - **Manage Your Library:** Easily view, rename, re-process, and delete your documents.
- **🌐 Data Portability:** Export your entire document library to a single JSON file and import it on another device or browser.
- **💬 Conversational Memory:** Remembers the last few messages to understand follow-up questions and provide context-aware answers.

## ⚙️ How It Works: The RAG Pipeline

KnowledgeMate uses a sophisticated RAG pipeline to provide accurate answers from your documents:

1.  **Ingestion & Processing:** When you upload a file, its text is extracted and broken down into smaller, manageable chunks.
2.  **Indexing (Embedding):** Depending on the selected mode, chunks are indexed either by their keywords (TF-IDF) or by their semantic meaning using an in-browser AI model (Semantic).
3.  **Retrieval:** When you ask a question, the app finds the most relevant chunks from your documents.
4.  **Augmented Generation:** The relevant chunks, your conversation history, and your question are combined into a detailed prompt, which is sent to the AI to generate a final, grounded answer.

## 🛠️ Technology Stack

- **Frontend:** React, TypeScript, Tailwind CSS
- **AI & ML (In-Browser):**
    - **Semantic Search:** `@xenova/transformers.js`
    - **LLM Interaction:** `@google/genai` SDK & `fetch` API
- **Document Handling:**
    - **PDF Parsing:** PDF.js (by Mozilla)
    - **Client-Side Storage:** `localforage` (for IndexedDB)
- **Browser APIs:** Web Crypto API, FileReader, Drag & Drop API

## 🚀 Getting Started

Getting started is simple, as there's no backend to set up.

1.  **Download:** Download or clone this repository to your local machine.
2.  **Open:** Open the `index.html` file directly in your web browser (e.g., Chrome, Firefox, Edge).
3.  **Configure:**
    - Click the **Settings** icon.
    - Select your preferred AI Provider.
    - Enter your API key.
    - Click **Save**.
4.  **Chat!** Upload your documents and start asking questions.

## 🏛️ Architecture & Contributing

- **Deep Dive:** For a detailed look at the project's architecture, components, and data flow, see [ARCHITECTURE.md](./ARCHITECTURE.md).
- **Contribute:** We welcome contributions! Please read our [CONTRIBUTING.md](./CONTRIBUTING.md) to learn how you can help.

## 📜 License

This project is licensed under the MIT License.
