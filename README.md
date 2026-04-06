# AI Document Summarizer

> **An intelligent web application that transforms lengthy documents into concise, customizable summaries using IBM's Granite AI model.**

---

## 🎯 Project Overview

Upload a PDF or TXT document and receive AI-generated summaries in multiple formats, with full user authentication and per-user history.

### What It Does
- **TL;DR** — Ultra-short 2-3 sentence overview
- **Detailed** — Comprehensive paragraph-form summary
- **Bullet Points** — Key takeaways in list format
- **ELI5** — Simplified explanation anyone can understand

---

## 🏗️ Technology Stack

### Frontend
| Library | Version | Purpose |
|---------|---------|---------|
| React | 18 | UI framework |
| Tailwind CSS | 3 | Styling |
| Vite | 5 | Build tool |
| React Router | 6 | Navigation |
| Axios | 1.x | HTTP client |
| react-dropzone | — | File upload |
| react-hot-toast | — | Notifications |
| lucide-react | — | Icons |

### Backend
| Library | Version | Purpose |
|---------|---------|---------|
| Node.js | 18+ | Runtime |
| Express | 4 | Web framework |
| bcryptjs | 2.x | Password hashing |
| Multer | — | File upload handling |
| pdf-parse | — | PDF text extraction |
| uuid | — | ID generation |
| Axios | — | IBM API calls |

### AI Service
- **IBM watsonx.ai** — AI platform
- **IBM Granite** — Text generation model

### Storage
- **In-Memory Maps** — Server-side data store (resets on restart)
- **localStorage** — User session persistence in browser

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- npm
- IBM Cloud account with watsonx.ai access

### 1. Install dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 2. Configure environment variables

**`server/.env`**
```bash
PORT=5000
NODE_ENV=development
WATSONX_API_KEY=your_api_key_here
WATSONX_PROJECT_ID=your_project_id_here
WATSONX_SERVICE_URL=https://us-south.ml.cloud.ibm.com
MAX_FILE_SIZE=5242880
FRONTEND_URL=http://localhost:5173
```

**`client/.env`**
```bash
VITE_API_URL=http://localhost:5000/api
```

### 3. Start servers

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

Access the app at **http://localhost:5173**

---

## 📁 Project Structure

```
DesafioTecnico_IBM/
├── client/                        # React frontend
│   └── src/
│       ├── components/
│       │   ├── common/            # Button, Card, LoadingSpinner, ErrorMessage
│       │   ├── layout/            # Header, Footer, Layout
│       │   ├── summary/           # SummaryDisplay, SummaryModeSelector
│       │   └── upload/            # FileUpload
│       ├── context/
│       │   ├── UserContext.jsx    # Auth state (user, login, logout, register)
│       │   └── SummaryContext.jsx # Summary state and history
│       ├── pages/
│       │   ├── LoginPage.jsx      # Login + Register
│       │   ├── HomePage.jsx       # Upload + Generate
│       │   ├── HistoryPage.jsx    # Summary history with modal
│       │   └── ProfilePage.jsx    # User profile + logout
│       ├── services/
│       │   ├── api.js             # Axios instance with interceptors
│       │   ├── userService.js     # User API calls
│       │   ├── documentService.js # Document upload API
│       │   └── summaryService.js  # Summary generation API
│       └── utils/
│           ├── constants.js       # App constants and config
│           └── formatters.js      # Formatters + password validator
│
└── server/                        # Express backend
    └── src/
        ├── controllers/
        │   ├── user.controller.js      # Create, login, get, update
        │   ├── summary.controller.js   # Generate, get, list, delete
        │   └── document.controller.js  # Upload and parse
        ├── services/
        │   ├── storage.service.js      # In-memory data store
        │   └── watsonx.service.js      # IBM Granite AI integration
        ├── routes/
        │   ├── user.routes.js
        │   ├── summary.routes.js
        │   └── document.routes.js
        ├── middleware/
        │   ├── validateRequest.js      # Input + password validation
        │   ├── errorHandler.js
        │   └── logger.js
        └── utils/
            ├── helpers.js
            └── constants.js
```

---

## 📖 API Reference

**Base URL:** `http://localhost:5000/api`

### Users

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `POST` | `/users` | `{ name, email, password }` | Register new user |
| `POST` | `/users/login` | `{ email, password }` | Login |
| `GET` | `/users/:userId` | — | Get user profile |
| `PUT` | `/users/:userId` | `{ name?, email? }` | Update profile |

### Documents

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `POST` | `/documents/upload` | `multipart/form-data` (file + userId) | Upload and parse document |

### Summaries

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `POST` | `/summaries/generate` | `{ documentId, mode, userId }` | Generate summary |
| `GET` | `/summaries/user/:userId` | — | Get all summaries for user |
| `GET` | `/summaries/:summaryId` | — | Get single summary |
| `DELETE` | `/summaries/:summaryId` | — | Delete summary |

---

## ✅ Implemented Features

### Authentication
- **Register** — Name, email, and password with strength enforcement
- **Login** — Email + password with bcrypt verification
- **Logout** — Clears session and all in-memory state
- **Protected routes** — Unauthenticated users are redirected to `/login`
- **Per-user data isolation** — Each user only sees their own summaries

### Password Security
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character
- Hashed with bcrypt (salt rounds: 10) — never stored or returned in plain text
- Real-time validation checklist shown during registration

### Document Processing
- Upload PDF and TXT files (max 5MB)
- Automatic text extraction
- Word count calculation stored on upload

### AI Summarization (IBM Granite)
- 4 summary modes: TL;DR, Detailed, Bullet Points, ELI5
- Stats per summary: original word count, summary word count, compression ratio, processing time
- Summaries are linked to the user who generated them

### History
- Lists all summaries for the logged-in user
- Click any card to open a modal with the full text and stats
- Copy to clipboard button inside modal

### Profile
- View name, email, registration date, total summary count
- Edit profile (name and email)
- Logout button

### UI / UX
- Show/hide password toggle (below field, no overlap)
- Toast notifications for all actions
- Loading spinners during async operations
- Responsive layout

---

## 🔑 Environment Variables

| Variable | Where | Description |
|----------|-------|-------------|
| `PORT` | server | Port to run Express (default 5000) |
| `NODE_ENV` | server | `development` or `production` |
| `WATSONX_API_KEY` | server | IBM Cloud API key |
| `WATSONX_PROJECT_ID` | server | watsonx.ai project ID |
| `WATSONX_SERVICE_URL` | server | IBM regional endpoint |
| `MAX_FILE_SIZE` | server | Max upload size in bytes |
| `FRONTEND_URL` | server | CORS allowed origin |
| `VITE_API_URL` | client | Backend API base URL |

---

## 🚧 Known Limitations

- In-memory storage — all data is lost when the server restarts
- No email verification
- No password reset flow
- Limited to PDF and TXT files
- Local deployment only

---

## 🔒 Security Notes

- Passwords hashed with bcrypt before storage
- `passwordHash` is never returned by any API endpoint
- Email/password login returns a generic error for both wrong email and wrong password (no enumeration)
- API keys are stored in `.env` (never committed)
- File type and size validated on upload

---

## 📚 Additional Documentation

| Document | Purpose |
|----------|---------|
| [PROJECT_PLAN.md](PROJECT_PLAN.md) | Original detailed plan and specifications |
| [ARCHITECTURE.md](ARCHITECTURE.md) | System architecture diagrams |
| [QUICK_START.md](QUICK_START.md) | Day-by-day implementation guide |

---

## 🤝 Acknowledgments

- **IBM watsonx.ai** — AI platform and Granite model
- **React** — Frontend framework
- **Express** — Backend framework
- **Tailwind CSS** — Utility-first styling

---

*Last Updated: April 5, 2026*
