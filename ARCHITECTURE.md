# System Architecture - AI Document Summarizer

## High-Level Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        UI[React Frontend<br/>Port 3000]
        UI --> Upload[File Upload]
        UI --> Summary[Summary Display]
        UI --> History[History View]
        UI --> Profile[Profile Management]
    end
    
    subgraph "Server Layer"
        API[Express API<br/>Port 5000]
        Routes[Routes Layer]
        Controllers[Controllers Layer]
        Services[Services Layer]
        
        API --> Routes
        Routes --> Controllers
        Controllers --> Services
    end
    
    subgraph "Services"
        WatsonX[WatsonX Service]
        FileParser[File Parser Service]
        Storage[Storage Service]
        Validation[Validation Service]
    end
    
    subgraph "External"
        IBM[IBM watsonx.ai<br/>Granite Model]
    end
    
    UI -->|HTTP/REST| API
    Services --> WatsonX
    Services --> FileParser
    Services --> Storage
    Services --> Validation
    WatsonX -->|HTTPS| IBM
```

## Data Flow - Summary Generation

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant FileParser
    participant WatsonX
    participant IBM as IBM Granite

    User->>Frontend: Upload Document
    Frontend->>Frontend: Validate File
    Frontend->>Backend: POST /api/documents/upload
    Backend->>FileParser: Extract Text
    FileParser-->>Backend: Extracted Text
    Backend-->>Frontend: Document Object
    
    User->>Frontend: Select Summary Mode
    User->>Frontend: Click Generate
    Frontend->>Backend: POST /api/summaries/generate
    Backend->>WatsonX: Generate Summary
    WatsonX->>WatsonX: Build Prompt
    WatsonX->>IBM: API Request
    IBM-->>WatsonX: AI Response
    WatsonX->>WatsonX: Post-Process
    WatsonX-->>Backend: Summary Text
    Backend->>Backend: Store in Memory
    Backend-->>Frontend: Summary Object
    Frontend->>Frontend: Display Result
    Frontend-->>User: Show Summary
```

## Component Architecture - Frontend

```mermaid
graph TD
    App[App.jsx]
    App --> Router[React Router]
    
    Router --> Home[HomePage]
    Router --> HistoryPage[HistoryPage]
    Router --> ProfilePage[ProfilePage]
    
    Home --> Layout[Layout Component]
    Layout --> Header[Header]
    Layout --> Footer[Footer]
    
    Home --> FileUpload[FileUpload Component]
    Home --> ModeSelector[SummaryModeSelector]
    Home --> SummaryDisplay[SummaryDisplay]
    
    HistoryPage --> HistoryList[HistoryList]
    HistoryList --> HistoryItem[HistoryItem]
    
    ProfilePage --> ProfileForm[ProfileForm]
    ProfilePage --> ProfileCard[ProfileCard]
    
    App --> UserContext[User Context]
    App --> SummaryContext[Summary Context]
    
    UserContext -.->|provides| Home
    UserContext -.->|provides| HistoryPage
    UserContext -.->|provides| ProfilePage
    
    SummaryContext -.->|provides| Home
    SummaryContext -.->|provides| HistoryPage
```

## Backend Structure

```mermaid
graph LR
    subgraph "Routes"
        UserRoutes[user.routes.js]
        DocRoutes[document.routes.js]
        SummaryRoutes[summary.routes.js]
    end
    
    subgraph "Controllers"
        UserCtrl[user.controller.js]
        DocCtrl[document.controller.js]
        SummaryCtrl[summary.controller.js]
    end
    
    subgraph "Services"
        WatsonXSvc[watsonx.service.js]
        ParserSvc[fileParser.service.js]
        StorageSvc[storage.service.js]
        ValidationSvc[validation.service.js]
    end
    
    UserRoutes --> UserCtrl
    DocRoutes --> DocCtrl
    SummaryRoutes --> SummaryCtrl
    
    UserCtrl --> StorageSvc
    DocCtrl --> ParserSvc
    DocCtrl --> StorageSvc
    SummaryCtrl --> WatsonXSvc
    SummaryCtrl --> StorageSvc
    SummaryCtrl --> ValidationSvc
```

## Data Model Relationships

```mermaid
erDiagram
    USER ||--o{ DOCUMENT : uploads
    USER ||--o{ SUMMARY : creates
    DOCUMENT ||--o{ SUMMARY : generates
    
    USER {
        string id PK
        string name
        string email
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

## State Management Flow

```mermaid
graph TD
    LocalStorage[localStorage]
    
    subgraph "User Context"
        UserState[User State]
        CreateUser[createUser]
        UpdateUser[updateUser]
    end
    
    subgraph "Summary Context"
        SummaryState[Summary State]
        CurrentSummary[currentSummary]
        SummaryHistory[summaries array]
        GenerateSummary[generateSummary]
        LoadHistory[loadHistory]
    end
    
    LocalStorage -->|load on mount| UserState
    UserState -->|save on change| LocalStorage
    
    GenerateSummary -->|creates| CurrentSummary
    GenerateSummary -->|adds to| SummaryHistory
    LoadHistory -->|populates| SummaryHistory
    
    UserState -.->|userId| GenerateSummary
    UserState -.->|userId| LoadHistory
```

## API Request Flow

```mermaid
graph LR
    Client[React Component]
    Service[API Service]
    Axios[Axios Instance]
    Backend[Express Server]
    
    Client -->|calls| Service
    Service -->|uses| Axios
    Axios -->|HTTP request| Backend
    Backend -->|JSON response| Axios
    Axios -->|returns data| Service
    Service -->|returns data| Client
    
    Client -->|on error| ErrorHandler[Error Handler]
    ErrorHandler -->|shows| Toast[Toast Notification]
```

## File Upload Process

```mermaid
flowchart TD
    Start([User Selects File])
    Start --> Validate{Valid Type<br/>and Size?}
    
    Validate -->|No| ShowError[Show Error Message]
    ShowError --> End([End])
    
    Validate -->|Yes| CreateFormData[Create FormData]
    CreateFormData --> SendToBackend[POST to /api/documents/upload]
    
    SendToBackend --> BackendReceive[Backend Receives File]
    BackendReceive --> ExtractText{File Type?}
    
    ExtractText -->|PDF| ParsePDF[Use pdf-parse]
    ExtractText -->|TXT| ReadText[Read as UTF-8]
    
    ParsePDF --> CleanText[Clean Text]
    ReadText --> CleanText
    
    CleanText --> StoreDoc[Store in Memory]
    StoreDoc --> ReturnDoc[Return Document Object]
    ReturnDoc --> DisplayPreview[Display File Preview]
    DisplayPreview --> End
```

## Summary Generation Process

```mermaid
flowchart TD
    Start([User Clicks Generate])
    Start --> CheckMode{Mode<br/>Selected?}
    
    CheckMode -->|No| ShowWarning[Show Warning]
    ShowWarning --> End([End])
    
    CheckMode -->|Yes| ShowLoading[Show Loading Spinner]
    ShowLoading --> BuildPrompt[Build Mode-Specific Prompt]
    
    BuildPrompt --> SetParams[Set Model Parameters]
    SetParams --> CallAPI[Call IBM watsonx.ai API]
    
    CallAPI --> APISuccess{API<br/>Success?}
    
    APISuccess -->|No| Retry{Retry<br/>Count < 3?}
    Retry -->|Yes| CallAPI
    Retry -->|No| ShowError[Show Error Message]
    ShowError --> End
    
    APISuccess -->|Yes| PostProcess[Post-Process Response]
    PostProcess --> Validate{Valid<br/>Summary?}
    
    Validate -->|No| ShowError
    Validate -->|Yes| StoreSummary[Store in Memory]
    
    StoreSummary --> CalcStats[Calculate Statistics]
    CalcStats --> UpdateHistory[Update History]
    UpdateHistory --> DisplayResult[Display Summary]
    DisplayResult --> HideLoading[Hide Loading Spinner]
    HideLoading --> End
```

## Error Handling Strategy

```mermaid
graph TD
    Error[Error Occurs]
    
    Error --> Type{Error Type?}
    
    Type -->|Validation| ValidationError[400 Bad Request]
    Type -->|Not Found| NotFoundError[404 Not Found]
    Type -->|File Size| FileSizeError[413 Payload Too Large]
    Type -->|File Type| FileTypeError[415 Unsupported Media]
    Type -->|AI Service| AIError[502 Bad Gateway]
    Type -->|Server| ServerError[500 Internal Error]
    
    ValidationError --> LogError[Log Error]
    NotFoundError --> LogError
    FileSizeError --> LogError
    FileTypeError --> LogError
    AIError --> LogError
    ServerError --> LogError
    
    LogError --> ReturnJSON[Return JSON Error Response]
    ReturnJSON --> FrontendReceive[Frontend Receives Error]
    FrontendReceive --> ShowToast[Show Toast Notification]
    ShowToast --> UserAction[User Can Retry]
```

## Deployment Architecture

```mermaid
graph TB
    subgraph "Development Environment"
        DevFrontend[React Dev Server<br/>localhost:3000]
        DevBackend[Express Server<br/>localhost:5000]
        DevFrontend <-->|CORS enabled| DevBackend
    end
    
    subgraph "Production Ready"
        ProdFrontend[Built React App<br/>Static Files]
        ProdBackend[Express Server<br/>with static serving]
        ProdFrontend -->|served by| ProdBackend
    end
    
    DevBackend -->|API calls| IBM[IBM watsonx.ai]
    ProdBackend -->|API calls| IBM
```

## Technology Stack Overview

```mermaid
mindmap
  root((AI Document<br/>Summarizer))
    Frontend
      React 18
      Tailwind CSS
      React Router
      Axios
      react-dropzone
      react-hot-toast
      Lucide Icons
    Backend
      Node.js
      Express
      Multer
      pdf-parse
      UUID
      dotenv
    AI Service
      IBM watsonx.ai
      Granite Model
      REST API
    Storage
      In-Memory Maps
      localStorage
    Development
      Vite
      Nodemon
      Git
```

## Security Considerations

```mermaid
graph TD
    Security[Security Measures]
    
    Security --> FileValidation[File Validation]
    FileValidation --> TypeCheck[Check File Type]
    FileValidation --> SizeCheck[Check File Size]
    
    Security --> APIKey[API Key Protection]
    APIKey --> EnvVars[Environment Variables]
    APIKey --> NoClientExposure[Never Send to Client]
    
    Security --> CORS[CORS Configuration]
    CORS --> AllowedOrigins[Whitelist Origins]
    
    Security --> InputValidation[Input Validation]
    InputValidation --> SanitizeInput[Sanitize User Input]
    InputValidation --> ValidateParams[Validate Parameters]
    
    Security --> ErrorHandling[Error Handling]
    ErrorHandling --> NoSensitiveInfo[Hide Sensitive Info]
    ErrorHandling --> GenericMessages[Generic Error Messages]
```

---

## Key Architectural Decisions

### 1. In-Memory Storage
**Decision**: Use JavaScript Maps for data storage  
**Rationale**: 
- Faster development (no database setup)
- Sufficient for demo/MVP
- Easy to migrate to database later
- No persistence needed for short demo

### 2. Context API for State
**Decision**: Use React Context instead of Redux  
**Rationale**:
- Simpler for small app
- Less boilerplate
- Sufficient for our needs
- Easier to understand

### 3. Monolithic Backend
**Decision**: Single Express server  
**Rationale**:
- Simpler deployment
- Easier development
- Sufficient scale for demo
- Can split later if needed

### 4. Client-Side Routing
**Decision**: React Router for navigation  
**Rationale**:
- Better UX (no page reloads)
- Easier state management
- Standard for SPAs

### 5. File Upload Strategy
**Decision**: Multer with memory storage  
**Rationale**:
- No disk I/O needed
- Faster processing
- Automatic cleanup
- Simpler implementation

---

## Scalability Considerations

### Current Architecture (MVP)
- In-memory storage
- Single server instance
- No caching
- Synchronous processing

### Future Enhancements
- Database (PostgreSQL/MongoDB)
- Redis caching
- Queue system for long documents
- Horizontal scaling
- CDN for static assets
- Rate limiting
- User authentication

---

## Performance Optimization

### Frontend
- Code splitting by route
- Lazy loading components
- Memoization for expensive operations
- Debounced search/filter
- Optimized re-renders

### Backend
- Response compression
- Request validation early
- Efficient text processing
- Connection pooling (future)
- Caching AI responses (future)

---

This architecture is designed to be:
- ✅ Simple to implement
- ✅ Easy to understand
- ✅ Quick to develop
- ✅ Ready to demo
- ✅ Scalable for future growth