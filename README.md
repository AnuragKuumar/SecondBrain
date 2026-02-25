# AI-Powered Second Brain

An intelligent knowledge management system with AI-powered summarization, tagging, and conversational search.

## Features

- 📝 Create and organize notes, links, and insights
- 🤖 AI auto-summarization using Ollama
- 🏷️ AI auto-tagging
- 🔍 Semantic search with pgvector
- 💬 Conversational AI queries (RAG)
- 🎨 Beautiful UI with Framer Motion animations

## Tech Stack

**Frontend:**
- Next.js 15
- React
- Tailwind CSS
- Framer Motion

**Backend:**
- Express.js
- PostgreSQL with pgvector
- Ollama (Gemma 3:4b)

## Local Development

### Prerequisites
- Node.js 18+
- PostgreSQL with pgvector extension
- Ollama with Gemma 3:4b model

### Setup

1. Clone the repository:
```bash
git clone https://github.com/AnuragKuumar/SecondBrain.git
cd SecondBrain
```

2. Install dependencies:
```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

3. Configure environment variables:

**Backend** (`backend/.env`):
```env
PORT=3001
DATABASE_URL=your_postgresql_connection_string
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=gemma3:4b
CORS_ORIGIN=http://localhost:3000
```

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

4. Set up database:
```bash
# Run the schema in your PostgreSQL database
psql your_database < backend/db/schema.sql
```

5. Start Ollama:
```bash
ollama run gemma3:4b
```

6. Start development servers:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Visit http://localhost:3000

## Deployment

### Frontend (Vercel)
The frontend is configured to deploy on Vercel. Connect your GitHub repository and it will auto-deploy.

### Backend (Railway/Render)
Deploy the backend separately on Railway, Render, or any Node.js hosting platform.

Update `frontend/.env.local` with your production backend URL.

## Project Structure

```
SecondBrain/
├── frontend/          # Next.js frontend
│   ├── app/          # App router pages
│   ├── components/   # React components
│   └── lib/          # API utilities
├── backend/          # Express backend
│   ├── src/
│   │   ├── routes/   # API routes
│   │   ├── services/ # Business logic
│   │   └── db/       # Database config
│   └── db/
│       └── schema.sql
└── docs/             # Documentation
```

## License

MIT
