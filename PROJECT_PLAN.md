# AI Document Summarizer — Project Plan

## Executive Summary

**Project**: AI-Powered Document Summarization Web Application  
**Target**: IBM Technical Internship Challenge  
**Deployment**: Local demo environment  
**Tech Stack**: React + Tailwind CSS, Node.js + Express, IBM Granite (watsonx.ai), bcryptjs

---

## 1. Product Definition

### What It Does
An intelligent web application that transforms lengthy documents into concise, customizable summaries using IBM's Granite AI model. Users register, log in, upload PDF or TXT files, and receive AI-generated summaries in multiple formats. Each user's history is private and isolated.

### Target Users
- **Students** — digest academic papers quickly
- **Professionals** — summarize reports and business documents
- **Researchers** — extract key insights from multiple sources
- **General Users** — understand complex documents in plain language

### Core Value Proposition
1. Multiple summary formats for different use cases
2. Secure, per-user history (data isolation)
3. Powered by IBM's trusted Granite model
4. Statistics per summary (word counts, compression, processing time)
5. Clean and intuitive interface

---

## 2. Implemented Features

### Authentication
| Feature | Status |
|---------|--------|
| User registration (name, email, password) | ✅ Done |
| Password strength enforcement | ✅ Done |
| Password hashed with bcrypt (salt 10) | ✅ Done |
| Login with email + password | ✅ Done |
| Logout with session clear | ✅ Done |
| Protected routes (redirect to /login) | ✅ Done |
| Per-user data isolation | ✅ Done |
| Duplicate email detection | ✅ Done |

**Password Rules** (enforced on both client and server):
- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (!@#$%^&* etc.)

### Document Processing
| Feature | Status |
|---------|--------|
| Upload PDF files (max 5MB) | ✅ Done |
| Upload TXT files (max 5MB) | ✅ Done |
| Drag-and-drop upload interface | ✅ Done |
| Automatic text extraction | ✅ Done |
| Word count on upload | ✅ Done |

### AI Summarization
| Feature | Status |
|---------|--------|
| TL;DR mode (2-3 sentences) | ✅ Done |
| Detailed mode (paragraph form) | ✅ Done |
| Bullet Points mode | ✅ Done |
| ELI5 (Explain Like I'm 5) mode | ✅ Done |
| Processing time tracking | ✅ Done |
| Original/summary word count | ✅ Done |
| Compression ratio calculation | ✅ Done |

### History
| Feature | Status |
|---------|--------|
| Per-user summary history | ✅ Done |
| Click to expand (modal with full text) | ✅ Done |
| Copy to clipboard in modal | ✅ Done |
| Stats in modal (words, compression, time) | ✅ Done |

### Profile
| Feature | Status |
|---------|--------|
| View name, email, registration date | ✅ Done |
| Total summary count (live) | ✅ Done |
| Edit name and email | ✅ Done |
| Logout button | ✅ Done |

---

## 3. Data Model

### User
```javascript
{
  id: string,           // UUID v4
  name: string,
  email: string,        // Unique
  passwordHash: string, // bcrypt hash — NEVER returned by API
  createdAt: Date,
  summaryCount: number  // Incremented on each summary created
}
```

### Document
```javascript
{
  id: string,           // UUID v4
  userId: string,       // Owner
  filename: string,
  fileType: string,     // 'pdf' | 'txt'
  fileSize: number,     // bytes
  textContent: string,  // Extracted text
  uploadedAt: Date,
  wordCount: number
}
```

### Summary
```javascript
{
  id: string,                // UUID v4
  userId: string,            // Owner — used for history isolation
  documentId: string,
  mode: string,              // 'tldr' | 'detailed' | 'bullets' | 'eli5'
  summaryText: string,
  originalWordCount: number,
  summaryWordCount: number,
  compressionRatio: number,  // Percentage reduction
  createdAt: Date,
  processingTime: number     // ms from request to response
}
```

### In-Memory Storage Structure
```javascript
{
  users: Map<id, User>,
  documents: Map<id, Document>,
  summaries: Map<id, Summary>,
  userSummaries: Map<userId, summaryId[]>,       // index for history lookup
  documentSummaries: Map<documentId, summaryId[]> // index for doc lookup
}
```

---

## 4. API Specification

**Base URL**: `http://localhost:5000/api`

### Users

#### POST /users — Register
**Body**: `{ name: string, email: string, password: string }`  
**Validation**: name and email required, password must pass regex  
**Duplicate check**: returns 400 if email already registered  
**Response**: `{ success: true, data: User }` (no passwordHash)

#### POST /users/login — Login
**Body**: `{ email: string, password: string }`  
**Logic**: finds user by email, bcrypt.compareSync  
**Response**: `{ success: true, data: User }` or 400 `"Invalid email or password"`

#### GET /users/:userId
**Response**: `{ success: true, data: User }` (no passwordHash)

#### PUT /users/:userId
**Body**: `{ name?, email? }`  
**Response**: `{ success: true, data: UpdatedUser }`

### Documents

#### POST /documents/upload
**Body**: `multipart/form-data` — `file` + `userId`  
**Response**: `{ success: true, data: Document }`

### Summaries

#### POST /summaries/generate
**Body**: `{ documentId: string, mode: string, userId: string }`  
**Logic**: calls IBM Granite, calculates stats, stores with userId  
**Response**: `{ success: true, data: Summary }`

#### GET /summaries/user/:userId
**Response**: `{ success: true, data: { summaries: Summary[] } }`  
**Note**: returns only summaries where `summary.userId === userId`

#### GET /summaries/:summaryId
**Response**: `{ success: true, data: Summary }`

#### DELETE /summaries/:summaryId
**Response**: `{ success: true, data: { message, summaryId } }`

---

## 5. Frontend Pages

### /login
- Tabs: Login / Create Account
- Login form: email + password (show/hide toggle below field)
- Register form: name + email + password with real-time strength checklist
- On success: `clearAll()` → set user → navigate to `/`

### / (HomePage) — Protected
- Step 1: Upload document (drag-and-drop or click)
- Step 2: Select summary mode (appears after upload)
- Step 3: View generated summary with statistics
- State persists in `SummaryContext` (survives tab navigation)

### /history — Protected
- Cards listing all summaries for logged-in user
- Click card → opens full-text modal via React Portal
- Modal has copy button + stats footer

### /profile — Protected
- Displays user info and total summary count
- Edit Profile form
- Logout button → `clearAll()` + `logout()` + navigate to `/login`

---

## 6. Security Considerations

- Passwords are hashed with bcrypt (salt 10) before storage
- `passwordHash` is stripped from every API response
- Login returns the same error for wrong email and wrong password (prevents user enumeration)
- API keys are in `.env` (not committed)
- File type and size validated on both client and server
- No JWT/session tokens — user ID from localStorage is trusted (demo scope)

---

## 7. Known Limitations

| Limitation | Notes |
|------------|-------|
| In-memory storage | All data lost on server restart |
| No email verification | Any email can be used |
| No password reset | No forgot-password flow |
| No JWT | userId from localStorage is not verified server-side |
| PDF/TXT only | No DOCX, PPTX support |
| 5MB file limit | Enforced by multer |
| Local only | No cloud deployment |

---

## 8. Environment Variables

### server/.env
```
PORT=5000
NODE_ENV=development
WATSONX_API_KEY=your_key
WATSONX_PROJECT_ID=your_project_id
WATSONX_SERVICE_URL=https://us-south.ml.cloud.ibm.com
MAX_FILE_SIZE=5242880
FRONTEND_URL=http://localhost:5173
```

### client/.env
```
VITE_API_URL=http://localhost:5000/api
```

---

## 9. Future Enhancements

- Database persistence (PostgreSQL or MongoDB)
- JWT authentication
- Email verification and password reset
- Additional file formats (DOCX, PPTX)
- Export summaries as PDF or TXT
- Cloud deployment (IBM Code Engine / Vercel)
- Rate limiting on API
- Summary comparison view (side-by-side modes)
- Dark mode

---

*Last Updated: April 5, 2026*
