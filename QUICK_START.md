# Quick Start — AI Document Summarizer

## Prerequisites

- Node.js 18+
- npm
- IBM Cloud account with watsonx.ai access

---

## 1. Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

---

## 2. Configure Environment Variables

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

---

## 3. Start the Servers

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 4. First Use

1. Go to **http://localhost:5173** — you will be redirected to `/login`
2. Click **Create Account**
3. Fill in name, email, and a password that meets all requirements:
   - Minimum 8 characters
   - At least one uppercase letter
   - At least one lowercase letter
   - At least one number
   - At least one special character
4. After registering, you are redirected to the home page
5. Upload a PDF or TXT file (max 5MB)
6. Select a summary mode and click **Generate Summary**
7. View your summary history at `/history`
8. Manage your profile at `/profile`

---

## 5. IBM watsonx.ai Setup

1. Create an IBM Cloud account at [cloud.ibm.com](https://cloud.ibm.com)
2. Create a watsonx.ai service instance
3. Go to **Manage → Access (IAM) → API Keys** and create a key
4. Copy your **Project ID** from the watsonx.ai project settings
5. Add both values to `server/.env`

---

## 6. Project Structure Reference

```
DesafioTecnico_IBM/
├── client/src/
│   ├── pages/
│   │   ├── LoginPage.jsx       ← /login (register + login tabs)
│   │   ├── HomePage.jsx        ← / (upload + summarize)
│   │   ├── HistoryPage.jsx     ← /history
│   │   └── ProfilePage.jsx     ← /profile
│   ├── context/
│   │   ├── UserContext.jsx     ← auth state
│   │   └── SummaryContext.jsx  ← summary + document state
│   ├── services/
│   │   ├── api.js              ← axios instance
│   │   ├── userService.js
│   │   ├── documentService.js
│   │   └── summaryService.js
│   └── utils/
│       ├── constants.js
│       └── formatters.js       ← includes validatePassword()
│
└── server/src/
    ├── controllers/
    │   ├── user.controller.js
    │   ├── document.controller.js
    │   └── summary.controller.js
    ├── services/
    │   ├── storage.service.js  ← in-memory store + bcrypt
    │   └── watsonx.service.js  ← IBM Granite integration
    ├── routes/
    └── middleware/
        ├── validateRequest.js  ← password regex enforcement
        └── errorHandler.js
```

---

## 7. API Quick Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/users` | Register |
| `POST` | `/api/users/login` | Login |
| `GET` | `/api/users/:id` | Get profile |
| `PUT` | `/api/users/:id` | Update profile |
| `POST` | `/api/documents/upload` | Upload file |
| `POST` | `/api/summaries/generate` | Generate summary |
| `GET` | `/api/summaries/user/:id` | User history |
| `DELETE` | `/api/summaries/:id` | Delete summary |

---

## 8. Troubleshooting

### IBM API not responding
- Verify `WATSONX_API_KEY` and `WATSONX_PROJECT_ID` in `server/.env`
- Check your IBM Cloud region matches `WATSONX_SERVICE_URL`
- Test the connection with a simple `curl` before running the app

### Registration fails with password error
- The password must meet all 5 rules simultaneously
- Check the real-time checklist shown during registration
- Server-side regex: `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[special]).{8,}$/`

### History shows summaries from previous session
- The server uses in-memory storage — restarting the server clears all data
- The client merges server data with in-session data (so summaries generated before restart still appear until you reload)

### Login fails after server restart
- All user accounts are lost when the server restarts (in-memory storage)
- Register a new account after each server restart

### Frontend can't reach backend
- Make sure `VITE_API_URL=http://localhost:5000/api` is set in `client/.env`
- Make sure the backend is running on port 5000
- Check browser console for CORS errors

### PDF upload fails
- Ensure the file is a valid PDF (not just renamed)
- Check file size is under 5MB
- Some scanned PDFs without text layers will return empty content

---

## 9. Development Commands

```bash
# Backend
cd server
npm run dev       # nodemon (auto-restart on change)
npm start         # production mode

# Frontend
cd client
npm run dev       # Vite dev server (HMR)
npm run build     # Production build
npm run preview   # Preview production build
```

---

*Last Updated: April 5, 2026*
