# Architecture

## System Design

### Portable Architecture
- **Frontend**: Next.js (React) - Pure UI layer
- **Backend**: Express API - Business logic & orchestration
- **AI Layer**: OpenAI service - Abstracted, swappable
- **Database**: PostgreSQL + pgvector - Data persistence

### Layers

```
Frontend (Next.js - Port 3000)
├── Pages (landing, dashboard, query, item detail)
├── Components (reusable UI)
└── API Client (fetch wrapper)
        ↓
Backend API (Express - Port 3001)
├── Routes (REST endpoints)
├── Services (business logic)
└── AI Integration
        ↓
Database (PostgreSQL)
└── Vector embeddings for semantic search
```

## Agent Thinking

Background processes that improve quality:
- Auto-summarization on item creation
- Auto-tagging based on content
- Embedding generation for semantic search
- Future: related items, insight extraction

## Infrastructure Mindset

This is a platform, not just an app:
- Clean API boundaries
- Swappable components
- Extensible architecture
- Public API ready (future)
