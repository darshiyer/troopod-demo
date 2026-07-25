# OmniBrain AI — Universal macOS Second Brain & MCP Server 🧠⚡

> **Privacy-First, Ultra-Fast (<50ms) Desktop Intelligence & Context Server for macOS**

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.11-green.svg)](https://python.org)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org)
[![MCP](https://img.shields.io/badge/Model_Context_Protocol-Anthropic-purple.svg)](https://modelcontextprotocol.io)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black.svg)](https://vercel.com)

**OmniBrain** is a lightweight background engine that indexes your macOS digital workspace (Chrome/Arc/Safari history, Obsidian markdown notes, terminal logs, code repos, and PDFs) using LanceDB memory-mapped vector search and SQLite FTS5.

---

## 🌟 Key Features

- **⚡ Sub-50ms Hybrid RAG Retrieval:** Combines LanceDB vector embeddings with SQLite FTS5 full-text search using Reciprocal Rank Fusion (RRF).
- **🔒 100% Privacy-First & Zero PyTorch RAM Overhead:** Operates on-device using fast C++ ONNX embeddings (`nomic-embed-text`) consuming `<100MB RAM`.
- **🔌 Model Context Protocol (MCP) Server:** Exposes your MacBook's memory natively to Cursor, Claude Desktop, and VS Code.
- **🕸️ Visual Knowledge Graph & Timeline:** Interactive 2D React Flow graph linking Notes 🔗 Web 🔗 Code 🔗 Terminal.

---

## 🚀 Quickstart

### 1. Backend Service (FastAPI & Indexer)
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend UI (Next.js 15)
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` to launch the OmniSearch dashboard.

---

## 🔌 Cursor & Claude Desktop MCP Integration

Add the following to your `~/.cursor/mcp.json` or `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "omnibrain": {
      "command": "python3",
      "args": ["-m", "backend.app.mcp_server"]
    }
  }
}
```
