# AI Document Summarizer - Project Documentation

> **An intelligent web application that transforms lengthy documents into concise, customizable summaries using IBM's Granite AI model.**

---

## 📚 Documentation Index

This project includes comprehensive planning documentation to guide development:

| Document | Purpose | When to Use |
|----------|---------|-------------|
| **[PROJECT_PLAN.md](PROJECT_PLAN.md)** | Complete detailed plan with all specifications | Reference throughout development |
| **[QUICK_START.md](QUICK_START.md)** | Day-by-day implementation guide | Daily development roadmap |
| **[ARCHITECTURE.md](ARCHITECTURE.md)** | Visual architecture diagrams and technical decisions | Understanding system design |
| **README.md** (this file) | Project overview and getting started | First-time setup |

---

## 🎯 Project Overview

### What It Does
Upload a document (PDF or text file) and receive AI-generated summaries in multiple formats:
- **TL;DR**: Ultra-short 2-3 sentence overview
- **Detailed**: Comprehensive paragraph-form summary
- **Bullet Points**: Key takeaways in list format
- **ELI5**: Simplified explanation (extended feature)

### Why It Matters
- **Time Savings**: Reduce document reading time by 80%+
- **Flexibility**: Multiple summary formats for different needs
- **Enterprise AI**: Powered by IBM's trusted Granite model
- **User-Friendly**: Clean, intuitive interface

---

## 🏗️ Technology Stack

### Frontend
- **React 18** - UI framework
- **Tailwind CSS 3** - Styling
- **Vite** - Build tool
- **React Router** - Navigation
- **Axios** - HTTP client
- **react-dropzone** - File upload
- **react-hot-toast** - Notifications

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **Multer** - File upload handling
- **pdf-parse** - PDF text extraction
- **Axios** - HTTP client for AI API

### AI Service
- **IBM watsonx.ai** - AI platform
- **Granite Model** - Text generation

### Storage
- **In-Memory Maps** - Data storage (MVP)
- **localStorage** - User profile persistence

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- IBM Cloud account with watsonx.ai access
- Code editor (VS Code recommended)

### Setup Steps

1. **Clone or create project structure**
   ```bash
   mkdir ai-document-summarizer
   cd ai-document-summarizer
   ```

2. **Review planning documents**
   - Read [`PROJECT_PLAN.md`](PROJECT_PLAN.md) for complete specifications
   - Check [`QUICK_START.md`](QUICK_START.md) for implementation roadmap
   - Review [`ARCHITECTURE.md`](ARCHITECTURE.md) for system design

3. **Setup IBM watsonx.ai**
   - Create IBM Cloud account at cloud.ibm.com
   - Create watsonx.ai service instance
   - Obtain API key and project ID
   - Save credentials securely

4. **Follow the implementation roadmap**
   - See [`QUICK_START.md`](QUICK_START.md) for day-by-day guide
   - Start with Day 1: Backend Foundation
   - Progress sequentially through each day

---

## 📋 Project Timeline

### 3-5 Day Development Plan

| Day | Focus | Deliverable |
|-----|-------|-------------|
| **Day 1** | Backend Foundation | Working file upload and AI connection |
| **Day 2** | AI Integration | All summary modes functional |
| **Day 3** | Frontend Core | End-to-end user flow working |
| **Day 4** | Polish & Features | Complete user experience |
| **Day 5** | Demo Ready | Polished, presentable product |

---

## 🎨 Key Features

### Core Features (MVP)
✅ Upload PDF and TXT files (max 5MB)  
✅ Extract text from documents  
✅ Generate summaries in 3 modes  
✅ Display results with statistics  
✅ View summary history  
✅ Basic user profile  
✅ Clean, modern UI  

### Extended Features
🎯 ELI5 (Explain Like I'm 5) mode  
🎯 Export summaries as files  
🎯 Summary comparison view  
🎯 Advanced statistics  
🎯 Dark mode  

---

## 📊 System Architecture

### High-Level Overview

```
┌─────────────┐
│   React     │ ← User Interface
│  Frontend   │   (Port 3000)
└──────┬──────┘
       │ HTTP/REST
┌──────▼──────┐
│   Express   │ ← API Server
│   Backend   │   (Port 5000)
└──────┬──────┘
       │ HTTPS
┌──────▼──────┐
│ IBM Granite │ ← AI Service
│  watsonx.ai │   (Cloud)
└─────────────┘
```

For detailed architecture diagrams, see [`ARCHITECTURE.md`](ARCHITECTURE.md).

---

## 🔑 Environment Variables

### Backend (.env)
```bash
PORT=5000
NODE_ENV=development
WATSONX_API_KEY=your_api_key_here
WATSONX_PROJECT_ID=your_project_id_here
WATSONX_SERVICE_URL=https://us-south.ml.cloud.ibm.com
MAX_FILE_SIZE=5242880
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:5000/api
```

---

## 📁 Project Structure

```
ai-document-summarizer/
├── docs/
│   ├── PROJECT_PLAN.md      # Complete detailed plan
│   ├── QUICK_START.md       # Implementation guide
│   ├── ARCHITECTURE.md      # System architecture
│   └── README.md            # This file
│
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── context/         # Context providers
│   │   ├── services/        # API services
│   │   ├── hooks/           # Custom hooks
│   │   └── utils/           # Utilities
│   └── package.json
│
└── server/                  # Express backend
    ├── src/
    │   ├── routes/          # API routes
    │   ├── controllers/     # Request handlers
    │   ├── services/        # Business logic
    │   ├── middleware/      # Express middleware
    │   ├── config/          # Configuration
    │   └── utils/           # Utilities
    └── package.json
```

---

## 🎬 Demo Strategy

### Video Structure (3-5 minutes)
1. **Introduction** (30s) - Project overview
2. **Core Demo** (2m) - Upload and summarize
3. **Features** (1m) - History and profile
4. **Technical** (1m) - Architecture highlights
5. **Closing** (30s) - Summary and next steps

### Key Talking Points
- Multiple summary modes for different use cases
- Clean architecture with separation of concerns
- IBM Granite integration with prompt engineering
- Professional UI/UX design
- Scalable and maintainable code

---

## 🎯 Success Criteria

### Technical
- ✅ All core features working
- ✅ Clean, maintainable code
- ✅ Proper error handling
- ✅ Responsive UI
- ✅ Good performance (<5s summaries)

### Demo
- ✅ Smooth presentation
- ✅ All features demonstrated
- ✅ Technical depth shown
- ✅ Professional appearance

---

## 🛠️ Development Commands

### Backend
```bash
cd server
npm install
npm run dev          # Start development server
npm start            # Start production server
```

### Frontend
```bash
cd client
npm install
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

---

## 📖 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/users` | Create user profile |
| GET | `/users/:userId` | Get user profile |
| POST | `/documents/upload` | Upload document |
| POST | `/summaries/generate` | Generate summary |
| GET | `/summaries/user/:userId` | Get user summaries |
| GET | `/summaries/:summaryId` | Get specific summary |
| DELETE | `/summaries/:summaryId` | Delete summary |

For complete API specifications, see [`PROJECT_PLAN.md`](PROJECT_PLAN.md#5-api-specification).

---

## 🔒 Security Considerations

- ✅ API keys stored in environment variables
- ✅ File type and size validation
- ✅ Input sanitization
- ✅ CORS configuration
- ✅ Error messages don't expose sensitive info
- ✅ No authentication needed (demo/MVP)

---

## 🚧 Known Limitations (MVP)

- In-memory storage (data lost on restart)
- No user authentication
- Single user session
- Limited to PDF and TXT files
- 5MB file size limit
- Local deployment only

### Future Enhancements
- Database persistence (PostgreSQL/MongoDB)
- User authentication and authorization
- Multi-user support
- Additional file formats (DOCX, PPTX)
- Cloud deployment
- Rate limiting
- Caching layer

---

## 🤝 Contributing

This is a technical challenge project. For production use:
1. Add database persistence
2. Implement authentication
3. Add comprehensive testing
4. Setup CI/CD pipeline
5. Deploy to cloud platform
6. Add monitoring and logging

---

## 📝 License

This project is created for educational and demonstration purposes as part of a technical internship challenge.

---

## 🙏 Acknowledgments

- **IBM watsonx.ai** - AI platform and Granite model
- **React Team** - Frontend framework
- **Express Team** - Backend framework
- **Tailwind CSS** - Styling framework

---

## 📞 Next Steps

1. ✅ Review all planning documents
2. ✅ Setup IBM watsonx.ai account
3. ✅ Create project structure
4. ✅ Start Day 1 implementation
5. ✅ Follow [`QUICK_START.md`](QUICK_START.md) roadmap

---

## 📚 Additional Resources

- [IBM watsonx.ai Documentation](https://www.ibm.com/docs/en/watsonx-as-a-service)
- [React Documentation](https://react.dev)
- [Express Documentation](https://expressjs.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)

---

**Ready to build? Start with [`QUICK_START.md`](QUICK_START.md)! 🚀**

---

*Last Updated: April 2, 2026*