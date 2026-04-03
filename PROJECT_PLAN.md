# AI Document Summarizer - Complete Project Plan

## Executive Summary

**Project**: AI-Powered Document Summarization Web Application  
**Timeline**: 3-5 days  
**Target**: Technical internship challenge demonstration  
**Deployment**: Local demo environment  
**Tech Stack**: React + Tailwind CSS, Node.js + Express, IBM Granite (watsonx.ai)

---

## 1. Product Definition

### Product Description
An intelligent web application that transforms lengthy documents into concise, customizable summaries using IBM's Granite AI model. Users can upload PDF or text documents and receive AI-generated summaries in multiple formats tailored to their needs.

### Target Users
- **Students**: Quickly digest academic papers and research materials
- **Professionals**: Summarize reports, articles, and business documents
- **Researchers**: Extract key insights from multiple sources efficiently
- **General Users**: Understand complex documents in simplified language

### Core Value Proposition
1. **Time Savings**: Reduce document reading time by 80%
2. **Flexibility**: Multiple summary formats for different use cases
3. **Accessibility**: Simplify complex content for broader understanding
4. **Personal History**: Track and revisit previous summaries
5. **Enterprise AI**: Powered by IBM's trusted Granite model

---

## 2. Scope Definition

### MVP (Must-Have Features) - Days 1-3

**Core Functionality**:
- ✅ Document upload (PDF and .txt files, max 5MB)
- ✅ Text extraction from uploaded files
- ✅ AI summary generation via IBM Granite
- ✅ Display summary results with clear formatting
- ✅ Basic user profile (name/email, no authentication)
- ✅ Summary history (in-memory storage)

**Summary Modes** (MVP includes 3):
- ✅ TL;DR (2-3 sentences)
- ✅ Detailed Summary (paragraph format)
- ✅ Bullet Points (key takeaways)

**UI/UX**:
- ✅ Clean, modern interface with Tailwind CSS
- ✅ Responsive design (desktop + tablet)
- ✅ Loading states and error handling
- ✅ File upload with drag-and-drop

### Extended Features (Nice-to-Have) - Days 4-5

**If Time Permits**:
- 🎯 ELI5 (Explain Like I'm 5) summary mode
- 🎯 Export summaries as PDF or text file
- 🎯 Summary comparison view (side-by-side modes)
- 🎯 Document preview before summarization
- 🎯 Character/word count statistics
- 🎯 Mobile responsive optimization
- 🎯 Dark mode toggle

**Explicitly Out of Scope**:
- ❌ User authentication/login system
- ❌ Database persistence (using in-memory storage)
- ❌ Multi-language support
- ❌ Real-time collaboration
- ❌ Advanced document formats (DOCX, PPTX)

### Prioritization Rationale
- **Focus on core AI functionality first**: The differentiator is the quality and variety of summaries
- **Simplify infrastructure**: In-memory storage allows faster development
- **Prioritize user experience**: Clean UI and multiple summary modes over complex features
- **Demo-ready approach**: Working end-to-end flow is more valuable than partial advanced features

---

## 3. System Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  React Application (Port 3000)                         │ │
│  │  - Upload Interface                                    │ │
│  │  - Summary Display                                     │ │
│  │  - History View                                        │ │
│  │  - Profile Management                                  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/REST
┌─────────────────────────────────────────────────────────────┐
│                        SERVER LAYER                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Express API Server (Port 5000)                        │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │ │
│  │  │   Routes     │  │ Controllers  │  │  Services   │ │ │
│  │  │  /api/...    │→ │   Business   │→ │   Logic     │ │ │
│  │  │              │  │    Logic     │  │             │ │ │
│  │  └──────────────┘  └──────────────┘  └─────────────┘ │ │
│  │                                                        │ │
│  │  ┌──────────────┐  ┌──────────────┐                  │ │
│  │  │  File Parser │  │  In-Memory   │                  │ │
│  │  │  (PDF/TXT)   │  │    Store     │                  │ │
│  │  └──────────────┘  └──────────────┘                  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTPS/API
┌─────────────────────────────────────────────────────────────┐
│                      EXTERNAL SERVICES                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  IBM watsonx.ai - Granite Model                        │ │
│  │  - Text generation endpoint                            │ │
│  │  - Model: granite-13b-chat-v2                          │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

**Frontend (React + Tailwind)**:
- User interface rendering and interactions
- File upload handling and validation
- API communication with backend
- State management for user session and history
- Display formatting for different summary types
- Client-side error handling and loading states

**Backend (Node.js + Express)**:
- RESTful API endpoints
- File upload processing and validation
- Text extraction from PDF and TXT files
- Communication with IBM Granite API
- Prompt engineering for different summary modes
- In-memory data storage and retrieval
- Error handling and logging

**IBM Granite (watsonx.ai)**:
- Natural language processing
- Text summarization generation
- Context understanding and key point extraction

### End-to-End Data Flow

**Step-by-Step Process**:

1. **User Uploads Document**
   - User selects file via upload button or drag-and-drop
   - Frontend validates file type (.pdf, .txt) and size (<5MB)
   - File is sent to backend via multipart/form-data POST request

2. **Backend Receives File**
   - Express middleware (multer) handles file upload
   - File is temporarily stored in memory buffer
   - File type validation occurs server-side

3. **Text Extraction**
   - PDF files: Use `pdf-parse` library to extract text
   - TXT files: Read directly as UTF-8 text
   - Extracted text is cleaned (remove extra whitespace, special characters)

4. **User Selects Summary Mode**
   - Frontend sends summary request with:
     - Extracted text content
     - Selected summary mode (tldr/detailed/bullets)
     - User profile ID

5. **Prompt Construction**
   - Backend service constructs mode-specific prompt
   - Adds context and formatting instructions
   - Includes text content to summarize

6. **AI Processing**
   - Backend sends request to IBM watsonx.ai API
   - Includes API key, model parameters, and prompt
   - Waits for streaming or complete response

7. **Response Processing**
   - Backend receives AI-generated summary
   - Validates and formats response
   - Stores summary in in-memory history store
   - Associates with user profile

8. **Return to Frontend**
   - Backend sends JSON response with:
     - Summary text
     - Summary metadata (mode, timestamp, word count)
     - Summary ID for history reference

9. **Display Results**
   - Frontend renders summary in appropriate format
   - Shows metadata and statistics
   - Updates history list
   - Enables export/share options

---

*[Document continues in next section...]*
## 4. Data Model

### In-Memory Data Structures

**User Profile**:
```javascript
{
  id: string,              // UUID v4
  name: string,            // User's display name
  email: string,           // User's email
  createdAt: Date,         // Profile creation timestamp
  summaryCount: number     // Total summaries generated
}
```

**Document**:
```javascript
{
  id: string,              // UUID v4
  userId: string,          // Reference to User.id
  filename: string,        // Original filename
  fileType: string,        // 'pdf' or 'txt'
  fileSize: number,        // Size in bytes
  textContent: string,     // Extracted text
  uploadedAt: Date,        // Upload timestamp
  wordCount: number        // Number of words in document
}
```

**Summary**:
```javascript
{
  id: string,              // UUID v4
  userId: string,          // Reference to User.id
  documentId: string,      // Reference to Document.id
  mode: string,            // 'tldr' | 'detailed' | 'bullets' | 'eli5'
  summaryText: string,     // Generated summary content
  originalWordCount: number,  // Words in original document
  summaryWordCount: number,   // Words in summary
  compressionRatio: number,   // Percentage reduction
  createdAt: Date,         // Generation timestamp
  processingTime: number   // Time taken in milliseconds
}
```

### Storage Implementation

```javascript
// In-memory store structure
const dataStore = {
  users: Map<string, User>,
  documents: Map<string, Document>,
  summaries: Map<string, Summary>,
  
  // Helper indexes for quick lookups
  userSummaries: Map<string, string[]>,  // userId -> summaryIds[]
  documentSummaries: Map<string, string[]>  // documentId -> summaryIds[]
};
```

### Data Relationships

```
User (1) ──────── (N) Document
  │                      │
  │                      │
  └────── (N) Summary (N)┘
```

- One user can have many documents
- One user can have many summaries
- One document can have many summaries (different modes)
- Each summary belongs to one user and one document

---

## 5. API Specification

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### 1. Create User Profile

**POST** `/users`

Creates a new user profile for the session.

**Request**:
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "createdAt": "2026-04-02T22:30:00.000Z",
    "summaryCount": 0
  }
}
```

#### 2. Get User Profile

**GET** `/users/:userId`

Retrieves user profile information.

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "createdAt": "2026-04-02T22:30:00.000Z",
    "summaryCount": 5
  }
}
```

#### 3. Upload Document

**POST** `/documents/upload`

Uploads and processes a document file.

**Request** (multipart/form-data):
```
file: [PDF or TXT file]
userId: "550e8400-e29b-41d4-a716-446655440000"
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "filename": "research-paper.pdf",
    "fileType": "pdf",
    "fileSize": 2048576,
    "textContent": "Extracted text content...",
    "uploadedAt": "2026-04-02T22:35:00.000Z",
    "wordCount": 3500
  }
}
```

#### 4. Generate Summary

**POST** `/summaries/generate`

Generates an AI summary for a document.

**Request**:
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "documentId": "660e8400-e29b-41d4-a716-446655440001",
  "mode": "tldr",
  "textContent": "Full document text..."
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440002",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "documentId": "660e8400-e29b-41d4-a716-446655440001",
    "mode": "tldr",
    "summaryText": "This research paper explores...",
    "originalWordCount": 3500,
    "summaryWordCount": 45,
    "compressionRatio": 98.7,
    "createdAt": "2026-04-02T22:36:00.000Z",
    "processingTime": 2340
  }
}
```

#### 5. Get User Summary History

**GET** `/summaries/user/:userId`

Retrieves all summaries for a specific user.

**Query Parameters**:
- `limit` (optional): Number of results (default: 20)
- `offset` (optional): Pagination offset (default: 0)

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "summaries": [
      {
        "id": "770e8400-e29b-41d4-a716-446655440002",
        "documentId": "660e8400-e29b-41d4-a716-446655440001",
        "filename": "research-paper.pdf",
        "mode": "tldr",
        "summaryText": "This research paper explores...",
        "compressionRatio": 98.7,
        "createdAt": "2026-04-02T22:36:00.000Z"
      }
    ],
    "total": 5,
    "limit": 20,
    "offset": 0
  }
}
```

#### 6. Get Specific Summary

**GET** `/summaries/:summaryId`

Retrieves a specific summary by ID.

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440002",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "documentId": "660e8400-e29b-41d4-a716-446655440001",
    "mode": "tldr",
    "summaryText": "This research paper explores...",
    "originalWordCount": 3500,
    "summaryWordCount": 45,
    "compressionRatio": 98.7,
    "createdAt": "2026-04-02T22:36:00.000Z",
    "processingTime": 2340
  }
}
```

#### 7. Delete Summary

**DELETE** `/summaries/:summaryId`

Deletes a specific summary.

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Summary deleted successfully"
}
```

### Error Responses

All endpoints return consistent error format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "File size exceeds maximum limit of 5MB",
    "details": {}
  }
}
```

**Common Error Codes**:
- `VALIDATION_ERROR` (400): Invalid input data
- `NOT_FOUND` (404): Resource not found
- `FILE_TOO_LARGE` (413): File exceeds size limit
- `UNSUPPORTED_FILE_TYPE` (415): Invalid file format
- `AI_SERVICE_ERROR` (502): IBM Granite API error
- `INTERNAL_ERROR` (500): Server error

---

## 6. AI Integration Plan

### IBM watsonx.ai Setup

**Prerequisites**:
1. IBM Cloud account
2. watsonx.ai service instance
3. API key and project ID
4. Granite model access

**Configuration**:
```javascript
// config/watsonx.config.js
module.exports = {
  apiKey: process.env.WATSONX_API_KEY,
  projectId: process.env.WATSONX_PROJECT_ID,
  serviceUrl: 'https://us-south.ml.cloud.ibm.com',
  modelId: 'ibm/granite-13b-chat-v2',
  parameters: {
    max_new_tokens: 500,
    temperature: 0.7,
    top_p: 0.9,
    top_k: 50
  }
};
```

### Prompt Design Strategy

#### 1. TL;DR Mode (Ultra-Short Summary)

**Objective**: 2-3 sentence executive summary

**Prompt Template**:
```
You are a professional summarization assistant. Your task is to create an extremely concise TL;DR summary.

Instructions:
- Provide exactly 2-3 sentences
- Capture only the most critical main point
- Use clear, direct language
- No bullet points or formatting

Document to summarize:
{TEXT_CONTENT}

TL;DR:
```

**Parameters**:
- `max_new_tokens`: 100
- `temperature`: 0.5 (more focused)
- `stop_sequences`: ["\n\n"]

#### 2. Detailed Summary Mode

**Objective**: Comprehensive paragraph-form summary

**Prompt Template**:
```
You are a professional summarization assistant. Create a detailed, comprehensive summary of the following document.

Instructions:
- Write 2-4 well-structured paragraphs
- Include main arguments, key findings, and important details
- Maintain logical flow and coherence
- Use professional, clear language
- Preserve important context and nuance

Document to summarize:
{TEXT_CONTENT}

Detailed Summary:
```

**Parameters**:
- `max_new_tokens`: 500
- `temperature`: 0.7 (balanced)
- `stop_sequences`: ["\n\n\n"]

#### 3. Bullet Points Mode

**Objective**: Key takeaways in list format

**Prompt Template**:
```
You are a professional summarization assistant. Extract the key points from the following document and present them as a bullet-point list.

Instructions:
- Provide 5-8 bullet points
- Each point should be one clear, complete sentence
- Focus on main ideas, findings, and conclusions
- Order points by importance
- Start each bullet with a dash (-)

Document to summarize:
{TEXT_CONTENT}

Key Points:
```

**Parameters**:
- `max_new_tokens`: 400
- `temperature`: 0.6
- `stop_sequences`: ["\n\n"]

#### 4. ELI5 Mode (Extended Feature)

**Objective**: Simplified explanation for general audience

**Prompt Template**:
```
You are a friendly teacher explaining complex topics to a 10-year-old. Simplify the following document using everyday language and relatable examples.

Instructions:
- Use simple words and short sentences
- Avoid jargon and technical terms
- Include analogies or examples when helpful
- Make it engaging and easy to understand
- Write 2-3 paragraphs

Document to simplify:
{TEXT_CONTENT}

Simple Explanation:
```

**Parameters**:
- `max_new_tokens`: 400
- `temperature`: 0.8 (more creative)

### Output Format Control

**Consistency Strategies**:

1. **Prompt Engineering**:
   - Clear, specific instructions in each prompt
   - Explicit format requirements
   - Examples of desired output style

2. **Post-Processing**:
   - Trim extra whitespace
   - Remove incomplete sentences at the end
   - Validate bullet point format
   - Ensure minimum/maximum length requirements

3. **Error Handling**:
   - Retry logic for API failures (max 3 attempts)
   - Fallback to simpler prompt if complex one fails
   - Timeout handling (30 seconds max)
   - Graceful degradation with error messages

4. **Quality Checks**:
   ```javascript
   function validateSummary(summary, mode) {
     const checks = {
       tldr: summary.split('.').length >= 2 && summary.length < 500,
       detailed: summary.length > 200 && summary.length < 2000,
       bullets: summary.includes('-') && summary.split('-').length >= 5,
       eli5: summary.length > 150 && !hasComplexWords(summary)
     };
     return checks[mode];
   }
   ```

### API Integration Code Structure

```javascript
// services/watsonx.service.js
class WatsonXService {
  async generateSummary(textContent, mode) {
    const prompt = this.buildPrompt(textContent, mode);
    const parameters = this.getParameters(mode);
    
    try {
      const response = await this.callWatsonXAPI(prompt, parameters);
      const summary = this.postProcess(response, mode);
      return summary;
    } catch (error) {
      return this.handleError(error);
    }
  }
  
  buildPrompt(text, mode) { /* ... */ }
  getParameters(mode) { /* ... */ }
  callWatsonXAPI(prompt, params) { /* ... */ }
  postProcess(response, mode) { /* ... */ }
  handleError(error) { /* ... */ }
}
```

---

## 7. Frontend Structure

### Technology Stack
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS 3
- **State Management**: React Context API + useState/useReducer
- **HTTP Client**: Axios
- **File Upload**: react-dropzone
- **Icons**: Lucide React
- **Notifications**: react-hot-toast

### Component Architecture

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.jsx              # App header with logo and user info
│   │   ├── Footer.jsx              # Footer with credits
│   │   └── Layout.jsx              # Main layout wrapper
│   │
│   ├── upload/
│   │   ├── FileUpload.jsx          # Drag-and-drop upload component
│   │   ├── FilePreview.jsx         # Show uploaded file details
│   │   └── UploadProgress.jsx      # Upload progress indicator
│   │
│   ├── summary/
│   │   ├── SummaryModeSelector.jsx # Radio buttons for summary modes
│   │   ├── SummaryDisplay.jsx      # Display generated summary
│   │   ├── SummaryStats.jsx        # Show word count, compression ratio
│   │   └── SummaryActions.jsx      # Copy, export, regenerate buttons
│   │
│   ├── history/
│   │   ├── HistoryList.jsx         # List of past summaries
│   │   ├── HistoryItem.jsx         # Individual history entry
│   │   └── HistoryFilter.jsx       # Filter by mode, date
│   │
│   ├── profile/
│   │   ├── ProfileForm.jsx         # Create/edit user profile
│   │   └── ProfileCard.jsx         # Display user info
│   │
│   └── common/
│       ├── Button.jsx              # Reusable button component
│       ├── Card.jsx                # Card container
│       ├── LoadingSpinner.jsx      # Loading indicator
│       ├── ErrorMessage.jsx        # Error display
│       └── Modal.jsx               # Modal dialog
│
├── pages/
│   ├── HomePage.jsx                # Main upload and summarize page
│   ├── HistoryPage.jsx             # View all summaries
│   └── ProfilePage.jsx             # User profile management
│
├── context/
│   ├── UserContext.jsx             # User profile state
│   └── SummaryContext.jsx          # Summary history state
│
├── services/
│   ├── api.js                      # Axios instance and config
│   ├── userService.js              # User API calls
│   ├── documentService.js          # Document upload API calls
│   └── summaryService.js           # Summary generation API calls
│
├── hooks/
│   ├── useFileUpload.js            # File upload logic
│   ├── useSummary.js               # Summary generation logic
│   └── useHistory.js               # History management logic
│
├── utils/
│   ├── fileValidation.js           # File type and size validation
│   ├── formatters.js               # Date, number formatting
│   └── constants.js                # App constants
│
├── App.jsx                         # Main app component with routing
└── main.jsx                        # Entry point
```

### Page Structure

#### 1. Home Page (Main Interface)

**Layout**:
```
┌─────────────────────────────────────────────────────────┐
│  Header: Logo | User: John Doe | History Link           │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Upload Your Document                            │   │
│  │  ┌─────────────────────────────────────────┐   │   │
│  │  │  📄 Drag & drop or click to upload      │   │   │
│  │  │     Supports: PDF, TXT (max 5MB)        │   │   │
│  │  └─────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────┘   │
│                                                           │
│  [After upload shows file preview]                       │
│                                                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Choose Summary Type                             │   │
│  │  ○ TL;DR (Quick overview)                       │   │
│  │  ○ Detailed (Comprehensive)                     │   │
│  │  ○ Bullet Points (Key takeaways)               │   │
│  │  ○ ELI5 (Simple explanation)                   │   │
│  │                                                  │   │
│  │  [Generate Summary Button]                      │   │
│  └─────────────────────────────────────────────────┘   │
│                                                           │
│  [Loading spinner during generation]                     │
│                                                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Summary Result                                  │   │
│  │  ┌────────────────────────────────────────┐    │   │
│  │  │  Generated summary text appears here   │    │   │
│  │  │  ...                                    │    │   │
│  │  └────────────────────────────────────────┘    │   │
│  │                                                  │   │
│  │  📊 Stats: 3500 → 45 words (98.7% reduction)   │   │
│  │  ⏱️ Generated in 2.3s                           │   │
│  │                                                  │   │
│  │  [Copy] [Export] [Try Another Mode]             │   │
│  └─────────────────────────────────────────────────┘   │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

#### 2. History Page

**Layout**:
```
┌─────────────────────────────────────────────────────────┐
│  Header: Logo | User: John Doe | History Link           │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Your Summary History                                    │
│                                                           │
│  Filter: [All Modes ▼] [Last 7 days ▼] [Search...]     │
│                                                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │  📄 research-paper.pdf                           │   │
│  │  TL;DR • Apr 2, 2026 • 98.7% compression        │   │
│  │  "This research paper explores..."              │   │
│  │  [View Full] [Delete]                            │   │
│  └─────────────────────────────────────────────────┘   │
│                                                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │  📄 meeting-notes.txt                            │   │
│  │  Bullet Points • Apr 1, 2026 • 95.2% compression│   │
│  │  "- Key decision was to proceed with..."        │   │
│  │  [View Full] [Delete]                            │   │
│  └─────────────────────────────────────────────────┘   │
│                                                           │
│  [Load More]                                             │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

#### 3. Profile Page

**Layout**:
```
┌─────────────────────────────────────────────────────────┐
│  Header: Logo | User: John Doe | History Link           │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Your Profile                                            │
│                                                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Name: [John Doe                            ]   │   │
│  │  Email: [john.doe@example.com              ]   │   │
│  │                                                  │   │
│  │  [Update Profile]                                │   │
│  └─────────────────────────────────────────────────┘   │
│                                                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Statistics                                      │   │
│  │  • Total Summaries: 15                          │   │
│  │  • Member Since: Apr 1, 2026                    │   │
│  │  • Most Used Mode: TL;DR                        │   │
│  └─────────────────────────────────────────────────┘   │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### State Management Approach

**Simple Context-Based State**:
- User profile stored in Context + localStorage
- Summary history managed in Context
- Current document/summary in component state
- No complex state management library needed

---

## 8. Backend Structure

### Folder Organization

```
server/
├── src/
│   ├── config/
│   │   ├── watsonx.config.js       # IBM watsonx.ai configuration
│   │   ├── multer.config.js        # File upload configuration
│   │   └── cors.config.js          # CORS settings
│   │
│   ├── routes/
│   │   ├── index.js                # Route aggregator
│   │   ├── user.routes.js          # User endpoints
│   │   ├── document.routes.js      # Document upload endpoints
│   │   └── summary.routes.js       # Summary generation endpoints
│   │
│   ├── controllers/
│   │   ├── user.controller.js      # User business logic
│   │   ├── document.controller.js  # Document processing logic
│   │   └── summary.controller.js   # Summary generation logic
│   │
│   ├── services/
│   │   ├── watsonx.service.js      # IBM Granite API integration
│   │   ├── fileParser.service.js   # PDF/TXT text extraction
│   │   ├── storage.service.js      # In-memory data store
│   │   └── validation.service.js   # Input validation
│   │
│   ├── middleware/
│   │   ├── errorHandler.js         # Global error handling
│   │   ├── validateRequest.js      # Request validation
│   │   └── logger.js               # Request logging
│   │
│   ├── utils/
│   │   ├── prompts.js              # AI prompt templates
│   │   ├── helpers.js              # Utility functions
│   │   └── constants.js            # App constants
│   │
│   └── app.js                      # Express app setup
│
├── .env.example                    # Environment variables template
├── .gitignore
├── package.json
└── server.js                       # Entry point
```

### Separation of Concerns

**Three-Layer Architecture**:

1. **Routes Layer**: Define endpoints and HTTP methods
2. **Controllers Layer**: Handle request/response, orchestrate business logic
3. **Services Layer**: Implement core business logic and external integrations

### Key Implementation Files

**Express App Setup**:
```javascript
// src/app.js
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./middleware/logger');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);

// Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

module.exports = app;
```

**Storage Service** (In-Memory):
```javascript
// services/storage.service.js
class StorageService {
  constructor() {
    this.users = new Map();
    this.documents = new Map();
    this.summaries = new Map();
    this.userSummaries = new Map();
  }
  
  createUser(data) { /* ... */ }
  getUser(userId) { /* ... */ }
  createDocument(data) { /* ... */ }
  createSummary(data) { /* ... */ }
  getUserSummaries(userId, limit, offset) { /* ... */ }
}
```

**File Parser Service**:
```javascript
// services/fileParser.service.js
const pdfParse = require('pdf-parse');

class FileParserService {
  async extractText(buffer, fileType) {
    if (fileType === 'pdf') {
      return await this.parsePDF(buffer);
    } else if (fileType === 'txt') {
      return buffer.toString('utf-8');
    }
    throw new Error('Unsupported file type');
  }
  
  async parsePDF(buffer) {
    const data = await pdfParse(buffer);
    return this.cleanText(data.text);
  }
  
  cleanText(text) {
    return text
      .replace(/\s+/g, ' ')
      .replace(/[^\x20-\x7E\n]/g, '')
      .trim();
  }
}
```

---

## 9. UI/UX Plan

### Design Principles
1. **Simplicity First**: Clean, uncluttered interface
2. **Clear Feedback**: Loading states, success/error messages
3. **Progressive Disclosure**: Show options as needed
4. **Accessibility**: Proper contrast, keyboard navigation
5. **Responsive**: Works on desktop and tablet

### Color Scheme (Tailwind)
- **Primary**: Blue-600 (IBM-inspired)
- **Secondary**: Gray-700
- **Success**: Green-500
- **Error**: Red-500
- **Background**: Gray-50
- **Cards**: White with shadow

### User Flow

```
Start
  │
  ├─> First Visit?
  │     │
  │     ├─> Yes: Create Profile (name, email)
  │     │     │
  │     │     └─> Save to localStorage
  │     │
  │     └─> No: Load profile from localStorage
  │
  ├─> Upload Document
  │     │
  │     ├─> Drag & drop or click
  │     │
  │     ├─> Validate (type, size)
  │     │
  │     ├─> Show file preview
  │     │
  │     └─> Extract text (backend)
  │
  ├─> Select Summary Mode
  │     │
  │     ├─> TL;DR
  │     ├─> Detailed
  │     ├─> Bullet Points
  │     └─> ELI5 (if available)
  │
  ├─> Generate Summary
  │     │
  │     ├─> Show loading spinner
  │     │
  │     ├─> Call API
  │     │
  │     ├─> Display result
  │     │
  │     └─> Show statistics
  │
  ├─> Actions
  │     │
  │     ├─> Copy to clipboard
  │     ├─> Export as file
  │     ├─> Try another mode
  │     └─> Upload new document
  │
  └─> View History
        │
        ├─> List all summaries
        ├─> Filter by mode/date
        ├─> View full summary
        └─> Delete summary
```

### Screen Descriptions

**1. Welcome/Profile Screen** (First Visit Only):
- Simple form: name and email
- Friendly welcome message
- "Get Started" button
- Stored in localStorage for future visits

**2. Main Upload Screen**:
- Large drag-and-drop zone
- File type and size indicators
- Upload button as alternative
- Clear visual feedback on file selection

**3. Summary Mode Selection**:
- Radio buttons with descriptions
- Visual icons for each mode
- Recommended mode highlighted
- "Generate" button (disabled until mode selected)

**4. Loading State**:
- Animated spinner
- Progress message: "Analyzing document..."
- Estimated time indicator

**5. Results Display**:
- Summary text in readable format
- Statistics card (word counts, compression ratio, time)
- Action buttons (copy, export, regenerate)
- Option to try different mode

**6. History Page**:
- Card-based list layout
- Each card shows: filename, mode, date, preview
- Filter/search functionality
- Pagination for large lists

---

## 10. Implementation Roadmap

### Day 1: Foundation & Backend Core

**Morning (4 hours)**:
1. ✅ Project setup
   - Initialize React app with Vite
   - Initialize Node.js/Express server
   - Install dependencies
   - Setup folder structure

2. ✅ Backend foundation
   - Express app configuration
   - CORS and middleware setup
   - In-memory storage service
   - Basic error handling

**Afternoon (4 hours)**:
3. ✅ File upload functionality
   - Multer configuration
   - Document upload endpoint
   - PDF parser integration (pdf-parse)
   - Text extraction and cleaning

4. ✅ IBM watsonx.ai setup
   - Create IBM Cloud account
   - Setup watsonx.ai service
   - Get API credentials
   - Test basic API connection

### Day 2: AI Integration & Core Features

**Morning (4 hours)**:
5. ✅ AI service implementation
   - WatsonX service class
   - Prompt templates for each mode
   - API integration with error handling
   - Response post-processing

6. ✅ Summary generation endpoint
   - Summary controller
   - Generate summary logic
   - Store summaries in memory
   - Return formatted response

**Afternoon (4 hours)**:
7. ✅ User management
   - User creation endpoint
   - User profile retrieval
   - localStorage integration plan

8. ✅ Summary history
   - Get user summaries endpoint
   - Get specific summary endpoint
   - Delete summary endpoint
   - Pagination logic

### Day 3: Frontend Core & Integration

**Morning (4 hours)**:
9. ✅ Frontend foundation
   - Tailwind CSS setup
   - Layout components (Header, Footer)
   - Routing setup (React Router)
   - Context providers (User, Summary)

10. ✅ Upload interface
    - FileUpload component with react-dropzone
    - File validation
    - Upload progress indicator
    - File preview display

**Afternoon (4 hours)**:
11. ✅ Summary generation UI
    - Mode selector component
    - Generate button with loading state
    - API integration (Axios)
    - Error handling and notifications

12. ✅ Results display
    - SummaryDisplay component
    - Statistics display
    - Copy to clipboard functionality
    - Basic styling with Tailwind

### Day 4: Polish & Extended Features

**Morning (4 hours)**:
13. ✅ History page
    - HistoryList component
    - HistoryItem cards
    - Filter functionality
    - Delete summary action

14. ✅ Profile management
    - Profile creation form
    - Profile display
    - Update profile functionality
    - Statistics display

**Afternoon (4 hours)**:
15. 🎯 Extended features (if time permits)
## 11. Risk and Simplification Strategy

### Identified Technical Risks

#### Risk 1: IBM watsonx.ai API Issues

**Risk**: API rate limits, downtime, or authentication problems

**Mitigation**:
- Implement retry logic with exponential backoff
- Cache API responses for identical requests
- Create mock AI service for development/testing
- Have fallback error messages ready
- Test API thoroughly on Day 1

**Simplification**:
```javascript
// Mock service for development
class MockWatsonXService {
  async generateSummary(text, mode) {
    await delay(2000); // Simulate API delay
    return this.getMockSummary(mode);
  }
}
```

#### Risk 2: PDF Parsing Failures

**Risk**: Complex PDFs with images, tables, or unusual formatting

**Mitigation**:
- Use robust pdf-parse library
- Implement text cleaning and normalization
- Set maximum document size (5MB)
- Provide clear error messages for unsupported formats
- Test with various PDF types

**Simplification**:
- Focus on text-based PDFs initially
- Add warning about image-heavy PDFs
- Fallback to plain text upload if PDF fails

#### Risk 3: Large Document Processing

**Risk**: Very long documents causing timeouts or poor summaries

**Mitigation**:
- Implement 5MB file size limit
- Add word count limit (e.g., 10,000 words)
- Show warning for very long documents
- Consider chunking strategy for large texts
- Set API timeout to 30 seconds

**Simplification**:
- Truncate documents over word limit
- Summarize first N words only
- Clear user communication about limits

#### Risk 4: State Management Complexity

**Risk**: Complex state synchronization between components

**Mitigation**:
- Use simple Context API (no Redux needed)
- Keep state close to where it's used
- Use localStorage for persistence
- Implement clear data flow patterns

**Simplification**:
- Single source of truth per context
- Minimal global state
- Component-level state when possible

#### Risk 5: Time Constraints

**Risk**: Not completing all features in 3-5 days

**Mitigation**:
- Clear MVP definition (Days 1-3)
- Modular architecture (features can be added/removed)
- Daily progress checkpoints
- Flexible extended features list

**Simplification Strategy**:
1. **Day 1-2**: Backend must work perfectly
2. **Day 3**: Basic frontend must work
3. **Day 4-5**: Polish and extend

**Feature Cutting Priority** (if needed):
1. Cut first: ELI5 mode, export, dark mode
2. Cut second: History filtering, profile stats
3. Keep always: Upload, 3 summary modes, basic history

### Development Best Practices

**To Avoid Blockers**:
1. ✅ Test IBM API connection on Day 1
2. ✅ Use environment variables for all config
3. ✅ Implement error handling from the start
4. ✅ Keep components small and focused
5. ✅ Commit working code frequently
6. ✅ Test each feature before moving to next

**Quick Wins**:
- Use Tailwind for fast styling
- Use react-dropzone for upload (battle-tested)
- Use axios for API calls (simple)
- Use react-hot-toast for notifications (easy)

---

## 12. Differentiation Strategy

### What Makes This Project Stand Out

#### 1. Multiple Summary Modes (Core Differentiator)

**Why It Matters**:
- Shows understanding of different user needs
- Demonstrates AI prompt engineering skills
- More practical than single-mode summarizers

**Implementation Excellence**:
- Each mode has carefully crafted prompts
- Clear use case for each mode
- Visual distinction in UI
- Easy mode switching

#### 2. User-Centric Design

**Why It Matters**:
- Shows product thinking, not just coding
- Demonstrates UX awareness
- Professional polish

**Key Features**:
- Clean, modern interface
- Intuitive workflow
- Clear feedback at every step
- Helpful error messages
- Statistics that matter (compression ratio, time)

#### 3. IBM Granite Integration

**Why It Matters**:
- Shows ability to work with enterprise AI
- Demonstrates API integration skills
- Aligns with IBM's technology stack

**Showcase Points**:
- Proper error handling
- Efficient API usage
- Understanding of model parameters
- Prompt engineering expertise

#### 4. Complete Product Thinking

**Why It Matters**:
- Goes beyond "just make it work"
- Shows understanding of real-world usage
- Demonstrates planning and architecture skills

**Evidence**:
- User profiles (even without auth)
- History tracking
- Statistics and insights
- Export capabilities
- Thoughtful error handling

### Demo Presentation Strategy

#### Video Structure (3-5 minutes)

**1. Introduction (30 seconds)**:
- "Hi, I'm [Name], and I built an AI-powered document summarizer"
- "It uses IBM's Granite model to create summaries in multiple formats"
- Show the landing page

**2. Core Feature Demo (2 minutes)**:
- Upload a sample document (PDF)
- "Let's summarize this 10-page research paper"
- Show TL;DR mode: "Quick 2-sentence overview"
- Show Detailed mode: "Comprehensive summary"
- Show Bullet Points: "Key takeaways at a glance"
- Highlight statistics: "98% compression in 2.3 seconds"

**3. Additional Features (1 minute)**:
- Show history: "All summaries are saved"
- Show profile: "Track your usage"
- Show different document: "Works with PDFs and text files"
- If implemented: Show ELI5 mode or export

**4. Technical Highlights (1 minute)**:
- "Built with React and Node.js"
- "Integrated with IBM watsonx.ai Granite model"
- "Clean architecture with proper error handling"
- Show code snippet of prompt engineering
- Mention scalability considerations

**5. Closing (30 seconds)**:
- "This demonstrates both technical and product skills"
- "Ready for real-world use with proper deployment"
- "Thank you for watching"

#### Key Talking Points

**Technical Depth**:
- "I implemented custom prompt engineering for each summary type"
- "The architecture separates concerns: routes, controllers, services"
- "Error handling includes retry logic and graceful degradation"

**Product Thinking**:
- "I identified four distinct use cases for summaries"
- "The UI guides users through a clear workflow"
- "Statistics help users understand the value delivered"

**IBM Alignment**:
- "I chose Granite because it's enterprise-grade and reliable"
- "The integration follows IBM's best practices"
- "This could easily scale to handle multiple users"

### Presentation Tips

**Do**:
- ✅ Show working features confidently
- ✅ Explain design decisions
- ✅ Highlight technical challenges solved
- ✅ Demonstrate smooth user experience
- ✅ Show code quality (briefly)

**Don't**:
- ❌ Apologize for missing features
- ❌ Spend too long on one feature
- ❌ Show bugs or errors
- ❌ Read from a script
- ❌ Go over time limit

### Competitive Advantages

**vs. Basic Summarizers**:
- Multiple modes (not just one summary type)
- User history and profiles
- Professional UI/UX
- Statistics and insights

**vs. Complex Solutions**:
- Simple, focused feature set
- Fast to use
- No learning curve
- Works immediately

**Technical Excellence**:
- Clean code architecture
- Proper error handling
- Scalable design
- Well-documented

---

## 13. Environment Setup Guide

### Prerequisites Checklist

**Required**:
- [ ] Node.js 18+ installed
- [ ] npm or yarn package manager
- [ ] Code editor (VS Code recommended)
- [ ] Git for version control
- [ ] IBM Cloud account
- [ ] watsonx.ai service instance

**Optional**:
- [ ] Postman for API testing
- [ ] React DevTools browser extension

### Environment Variables

**Backend (.env)**:
```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# IBM watsonx.ai Configuration
WATSONX_API_KEY=your_api_key_here
WATSONX_PROJECT_ID=your_project_id_here
WATSONX_SERVICE_URL=https://us-south.ml.cloud.ibm.com

# File Upload Configuration
MAX_FILE_SIZE=5242880  # 5MB in bytes
ALLOWED_FILE_TYPES=application/pdf,text/plain

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env)**:
```bash
VITE_API_URL=http://localhost:5000/api
```

### Quick Start Commands

**Backend**:
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

**Frontend**:
```bash
cd client
npm install
npm run dev
```

### IBM watsonx.ai Setup Steps

1. **Create IBM Cloud Account**:
   - Go to cloud.ibm.com
   - Sign up for free account
   - Verify email

2. **Create watsonx.ai Instance**:
   - Navigate to Catalog
   - Search for "watsonx.ai"
   - Create service instance
   - Choose Lite plan (free)

3. **Get Credentials**:
   - Open watsonx.ai instance
   - Go to "Credentials" tab
   - Create new API key
   - Copy API key and project ID

4. **Test Connection**:
   - Use provided test script
   - Verify API responds correctly
   - Check model availability

---

## 14. Success Metrics

### Technical Success Criteria

**Functionality**:
- ✅ Upload PDF and TXT files successfully
- ✅ Extract text accurately from documents
- ✅ Generate summaries in all modes
- ✅ Display results with proper formatting
- ✅ Save and retrieve history
- ✅ Handle errors gracefully

**Performance**:
- ✅ Summary generation < 5 seconds (typical)
- ✅ File upload < 2 seconds (5MB file)
- ✅ Page load < 1 second
- ✅ No memory leaks in long sessions

**Quality**:
- ✅ Clean, readable code
- ✅ Proper error handling
- ✅ Responsive UI
- ✅ Consistent styling
- ✅ Clear documentation

### Demo Success Criteria

**Presentation**:
- ✅ Complete demo in 3-5 minutes
- ✅ Show all core features
- ✅ No technical issues during demo
- ✅ Clear explanation of value proposition

**Impression**:
- ✅ Professional appearance
- ✅ Smooth user experience
- ✅ Technical depth evident
- ✅ Product thinking demonstrated

---

## 15. Next Steps After Plan Approval

### Immediate Actions

1. **Review and Approve Plan**:
   - Confirm scope and timeline
   - Adjust priorities if needed
   - Clarify any questions

2. **Setup Development Environment**:
   - Install dependencies
   - Create project structure
   - Setup version control

3. **IBM watsonx.ai Setup**:
   - Create account
   - Get API credentials
   - Test connection

4. **Begin Day 1 Implementation**:
   - Follow roadmap sequentially
   - Test each component
   - Commit working code

### Questions to Resolve

Before starting implementation:
- [ ] IBM watsonx.ai credentials obtained?
- [ ] Development environment ready?
- [ ] Any scope adjustments needed?
- [ ] Timeline confirmed?

---

## Appendix: Technology Stack Details

### Frontend Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.0",
    "react-dropzone": "^14.2.3",
    "react-hot-toast": "^2.4.1",
    "lucide-react": "^0.294.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "vite": "^5.0.0"
  }
}
```

### Backend Dependencies

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "multer": "^1.4.5-lts.1",
    "pdf-parse": "^1.1.1",
    "axios": "^1.6.0",
    "uuid": "^9.0.1",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

---

## Summary

This plan provides a complete, execution-ready roadmap for building an AI-powered document summarization web application in 3-5 days. The architecture is simple yet scalable, the features are focused yet differentiated, and the implementation path is clear and pragmatic.

**Key Strengths**:
- ✅ Clear MVP vs. extended features
- ✅ Realistic timeline with daily milestones
- ✅ Risk mitigation strategies
- ✅ Strong differentiation through multiple summary modes
- ✅ Professional UI/UX design
- ✅ Complete technical specifications
- ✅ Demo-ready presentation strategy

**Ready to Implement**: This plan can be handed directly to a development team (or used for solo development) with confidence that it will result in a working, impressive demonstration project.

    - ELI5 summary mode
    - Export summary as file
    - Summary comparison view
    - Dark mode toggle

16. 🎯 UI/UX improvements
    - Animations and transitions
    - Mobile responsiveness
    - Accessibility improvements
    - Loading state refinements

### Day 5: Testing, Documentation & Demo Prep

**Morning (4 hours)**:
17. ✅ Testing & bug fixes
    - End-to-end testing
    - Edge case handling
    - Error scenario testing
    - Performance optimization

18. ✅ Documentation
    - README with setup instructions
    - API documentation
    - Code comments
    - Environment variables guide

**Afternoon (4 hours)**:
19. ✅ Demo preparation
    - Prepare sample documents
    - Create demo script
    - Record demo video
    - Prepare presentation slides

20. ✅ Final polish
    - UI refinements
    - Performance checks
    - Security review
    - Deployment preparation

### Task Prioritization Logic

**Must Complete (MVP)**:
- Days 1-3: Core functionality
- File upload → Text extraction → AI summarization → Display results
- Basic history and profile

**Should Complete (Enhanced)**:
- Day 4 morning: History and profile features
- Polish existing features

**Nice to Have (Extended)**:
- Day 4 afternoon: Additional modes and features
- Day 5: Testing and documentation

**Flexible (Time-Dependent)**:
- ELI5 mode
- Export functionality
- Advanced UI features

---
