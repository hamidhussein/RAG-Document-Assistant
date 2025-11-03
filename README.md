
# KnowledgeMate – Multi-LLM Client-Side Document Chatbot

**KnowledgeMate** is a 100% client-side, privacy-first chatbot that allows users to upload, manage, and query their own documents using multiple Large Language Models (LLMs) entirely in the browser.

---

## Features

- **Privacy-first & Client-side:** All document processing, embeddings, and AI interactions happen locally in the browser—your data never leaves your device.  
- **Multi-LLM Support:** Use your preferred LLM (OpenAI, Google Gemini, Llama, Anthropic Claude) via API keys.  
- **Document Management (CRUD):**  
  - Upload PDFs and text files  
  - View, rename, reprocess, or delete files  
- **Persistent Storage:** Uses IndexedDB (via localForage) to store document text, chunks, and embeddings for persistence across sessions.  
- **Smart Retrieval:** Dual-mode search:  
  - **TF-IDF Mode:** Fast keyword-based retrieval  
  - **Semantic Mode:** Embedding-based contextual search  
- **Conversational Memory:** Remembers the last 5 messages for follow-up questions and context-aware answers.  
- **Portable Knowledge Base:** Export and import your document library as JSON for portability.  

---

## Technologies Used

- **Frontend:** React + TypeScript  
- **Styling:** Tailwind CSS  
- **Document Parsing:** PDF.js for PDFs, FileReader API for text files  
- **Embeddings & AI:**  
  - @xenova/transformers.js (in-browser semantic embeddings)  
  - @google/genai SDK & Fetch API for multi-LLM integration  
- **Storage:** IndexedDB via localForage  
- **Other Browser APIs:**  
  - Web Crypto API for document hashing and duplicate detection  
  - Drag & Drop API for intuitive file upload  

---

## How KnowledgeMate Works

1. **Upload & Process Documents:** Extract text from PDFs and text files, then chunk into smaller sections for retrieval.  
2. **Generate Embeddings (Optional Semantic Mode):** Convert text chunks into vector embeddings for semantic search.  
3. **Retrieve Relevant Chunks:** Query the document library using TF-IDF or embeddings for context-aware results.  
4. **Build Prompt:** Combine the user query, top relevant chunks, and last 5 messages into a prompt for the LLM.  
5. **Generate Answer:** Send the prompt to the selected LLM via API key and return a helpful, context-aware response.  

---

## 📂 Usage

1. Clone the repository:  
```bash
git clone https://github.com/yourusername/knowledge-mate.git
```

2. Install dependencies:  
```bash
cd knowledge-mate
npm install
```

3. Start the development server:  
```bash
npm start
```

4. Open in your browser at `http://localhost:3000`  

5. Upload your documents, select your LLM, and start chatting!  


## Future Improvements

- Support additional document formats (Word, Excel)  
- Advanced in-browser semantic search with larger embedding models  
- User-configurable chunk size and overlap  
- Multi-language query support  

---

## Contributing

Contributions are welcome!  
1. Fork the repository  
2. Create a branch: `git checkout -b feature-name`  
3. Make changes  
4. Commit: `git commit -m "Add feature"`  
5. Push: `git push origin feature-name`  
6. Open a Pull Request  

---

## 📄 License

MIT License
