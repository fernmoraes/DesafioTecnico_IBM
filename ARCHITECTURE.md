# System Architecture - AI Document Summarizer

## High-Level Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                          │
│   React Application (Port 5173)                               │
│   Login · Register · Summarize · History · Profile            │
└───────────────────────┬──────────────────────────────────────┘
                        │ HTTP/REST (Axios)
┌───────────────────────▼──────────────────────────────────────┐
│                        SERVER LAYER                           │
│   Express API (Port 5000)                                     │
│                                                               │
│   Routes → Controllers → Services                             │
│   ├── user.routes         user.controller                     │
│   ├── document.routes     document.controller                 │
│   └── summary.routes      summary.controller                  │
│                                                               │
│   Services                                                    │
│   ├── storage.service   (in-memory Maps + bcrypt)             │
│   └── watsonx.service   (IBM Granite integration)             │
└───────────────────────┬──────────────────────────────────────┘
                        │ HTTPS
┌───────────────────────▼──────────────────────────────────────┐
│                     EXTERNAL SERVICES                         │
│   IBM watsonx.ai — Granite Model                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Storage

    User->>Frontend: Fill register form (name, email, password)
    Frontend->>Frontend: Validate password rules (client-side)
    Frontend->>Backend: POST /api/users { name, email, password }
    Backend->>Backend: validateUserCreation middleware
    Backend->>Storage: getUserByEmail (check duplicate)
    Storage-->>Backend: null (no duplicate)
    Backend->>Storage: createUser (bcrypt.hashSync password)
    Storage-->>Backend: safeUser (no passwordHash)
    Backend-->>Frontend: { success, data: safeUser }
    Frontend->>Frontend: setUser + localStorage

    User->>Frontend: Fill login form (email, password)
    Frontend->>Backend: POST /api/users/login { email, password }
    Backend->>Storage: getUserByEmail (raw with passwordHash)
    Backend->>Backend: bcrypt.compareSync(password, hash)
    Backend-->>Frontend: { success, data: safeUser } or 400 error
    Frontend->>Frontend: setUser + localStorage
```

---

## Summary Generation Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant WatsonX
    participant IBM as IBM Granite

    User->>Frontend: Upload file
    Frontend->>Backend: POST /api/documents/upload (multipart + userId)
    Backend->>Backend: pdf-parse or UTF-8 read
    Backend->>Backend: store document with wordCount
    Backend-->>Frontend: document object

    User->>Frontend: Select mode + click Generate
    Frontend->>Backend: POST /api/summaries/generate { documentId, mode, userId }
    Backend->>Backend: record startTime
    Backend->>WatsonX: generateSummary(textContent, mode)
    WatsonX->>IBM: API request with mode-specific prompt
    IBM-->>WatsonX: generated text
    WatsonX-->>Backend: summaryText
    Backend->>Backend: calculate processingTime, originalWordCount, summaryWordCount
    Backend->>Backend: storageService.createSummary (linked to userId)
    Backend-->>Frontend: summary object with all stats
    Frontend->>Frontend: setCurrentSummary + refreshUser (update summaryCount)
```

---

## Frontend Component Architecture

```mermaid
graph TD
    App --> Router[React Router]
    Router --> LoginPage
    Router --> ProtectedRoute

    ProtectedRoute --> Layout
    Layout --> Header
    Layout --> Footer
    Layout --> HomePage
    Layout --> HistoryPage
    Layout --> ProfilePage

    HomePage --> FileUpload
    HomePage --> SummaryModeSelector
    HomePage --> SummaryDisplay

    HistoryPage --> SummaryCard[Summary Cards]
    HistoryPage --> SummaryModal[Modal Portal]

    ProfilePage --> ProfileForm
    ProfilePage --> LogoutButton

    App --> UserContext
    App --> SummaryContext

    UserContext -.->|user, login, logout, register, refreshUser| HomePage
    UserContext -.->|user, logout| ProfilePage
    UserContext -.->|user| HistoryPage
    SummaryContext -.->|currentSummary, currentDocument| HomePage
    SummaryContext -.->|summaries, loadHistory| HistoryPage
    SummaryContext -.->|clearAll| LoginPage
    SummaryContext -.->|clearAll| ProfilePage
```

---

## Data Model

```mermaid
erDiagram
    USER ||--o{ DOCUMENT : uploads
    USER ||--o{ SUMMARY : creates
    DOCUMENT ||--o{ SUMMARY : generates

    USER {
        string id PK
        string name
        string email
        string passwordHash
        date createdAt
        number summaryCount
    }

    DOCUMENT {
        string id PK
        string userId FK
        string filename
        string fileType
        number fileSize
        string textContent
        date uploadedAt
        number wordCount
    }

    SUMMARY {
        string id PK
        string userId FK
        string documentId FK
        string mode
        string summaryText
        number originalWordCount
        number summaryWordCount
        number compressionRatio
        date createdAt
        number processingTime
    }
```

> `passwordHash` is never returned by any API endpoint — stripped in every `getUser`, `createUser`, and `updateUser` response.

---

## State Management

```mermaid
graph TD
    localStorage -->|load on mount| UserState

    subgraph UserContext
        UserState[user]
        login
        createUser
        updateUser
        refreshUser
        logout
    end

    subgraph SummaryContext
        currentSummary
        currentDocument
        summaries
        generateSummary
        loadHistory
        clearAll
    end

    UserState -->|save on change| localStorage
    logout -->|remove| localStorage

    generateSummary -->|sets| currentSummary
    generateSummary -->|prepends to| summaries
    generateSummary -->|triggers| refreshUser
    loadHistory -->|merges server + session| summaries
    clearAll -->|resets all| SummaryContext

    login -->|triggers| clearAll
    logout -->|triggers| clearAll
```

---

## Backend Module Map

```
server/src/
├── controllers/
│   ├── user.controller.js
│   │   ├── createUser      POST /users        — hash password, check email dup
│   │   ├── loginUser       POST /users/login  — bcrypt compare, strip hash
│   │   ├── getUser         GET  /users/:id
│   │   └── updateUser      PUT  /users/:id
│   ├── document.controller.js
│   │   └── uploadDocument  POST /documents/upload
│   └── summary.controller.js
│       ├── generateSummary POST /summaries/generate — tracks processingTime
│       ├── getSummary      GET  /summaries/:id
│       ├── getUserSummaries GET /summaries/user/:id
│       └── deleteSummary   DELETE /summaries/:id
│
├── services/
│   ├── storage.service.js
│   │   ├── createUser(data)         — bcrypt hash, returns safeUser
│   │   ├── getUserRaw(id)           — with passwordHash (for auth only)
│   │   ├── getUser(id)              — passwordHash stripped
│   │   ├── getUserByEmail(email)    — raw (for login verification)
│   │   ├── verifyPassword(user, pw) — bcrypt.compareSync
│   │   ├── updateUser(id, updates)  — re-hashes if password provided
│   │   ├── createDocument(data)
│   │   ├── createSummary(data)      — increments user.summaryCount
│   │   └── getUserSummaries(userId)
│   └── watsonx.service.js
│       └── generateSummary(text, mode) — mode-specific prompts
│
└── middleware/
    ├── validateRequest.js
    │   ├── validateUserCreation  — checks name/email/password + regex
    │   └── PASSWORD_REGEX        — /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[special]).{8,}$/
    └── errorHandler.js
```

---

## Password Security

```
Register
  └── Client validates rules in real-time (PasswordInput component)
      └── POST /api/users
          └── validateUserCreation middleware checks PASSWORD_REGEX
              └── storage.createUser → bcrypt.hashSync(password, 10)
                  └── passwordHash stored in memory Map
                      └── { passwordHash, ...rest } → only rest returned

Login
  └── POST /api/users/login { email, password }
      └── getUserByEmail → raw user (with hash)
          └── bcrypt.compareSync(password, passwordHash)
              └── match: strip hash, return safeUser
              └── no match: generic "Invalid email or password" (no enumeration)
```

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/users` | — | Register (name, email, password) |
| `POST` | `/api/users/login` | — | Login (email, password) |
| `GET` | `/api/users/:userId` | — | Get profile |
| `PUT` | `/api/users/:userId` | — | Update profile |
| `POST` | `/api/documents/upload` | userId in body | Upload PDF or TXT |
| `POST` | `/api/summaries/generate` | userId in body | Generate summary |
| `GET` | `/api/summaries/user/:userId` | — | User's summary history |
| `GET` | `/api/summaries/:summaryId` | — | Single summary |
| `DELETE` | `/api/summaries/:summaryId` | — | Delete summary |

---

## Error Handling

| Error Name | HTTP Status | Example |
|------------|-------------|---------|
| `ValidationError` | 400 | Invalid password, missing fields |
| `NotFoundError` | 404 | Summary not found |
| `AIServiceError` | 502 | IBM API failure |
| — | 413 | File too large (multer) |
| — | 415 | Unsupported file type |
| — | 500 | Unexpected server error |

All errors return `{ success: false, error: { message } }`.  
Sensitive details (stack traces, internal IDs) are never exposed.

---

## Key Architectural Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Storage | In-memory Maps | No DB setup needed for demo; easy to swap later |
| Auth | Email + password (bcrypt) | Secure enough for demo; no JWT needed |
| State | React Context API | Sufficient for app scale, no Redux overhead |
| Routing | React Router v6 + ProtectedRoute | Standard SPA pattern |
| File upload | Multer (memory storage) | No disk I/O, automatic cleanup |
| Password hashing | bcryptjs salt 10 | Industry standard, synchronous for simplicity |
| Modal | React Portal (createPortal) | Avoids z-index/overflow issues from layout |
| Summary isolation | userId stored on summary | Each user queries only their own data |

---

## Ports

| Service | Port |
|---------|------|
| React (Vite dev) | 5173 |
| Express API | 5000 |
| IBM watsonx.ai | cloud (HTTPS) |
