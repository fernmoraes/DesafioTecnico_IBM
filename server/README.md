# AI Document Summarizer - Backend API

Backend server for the AI Document Summarizer application using IBM Granite via watsonx.ai.

## Features

- 📄 Document upload and processing (PDF, TXT)
- 🤖 AI-powered summarization with IBM Granite
- 📊 Multiple summary modes (TL;DR, Detailed, Bullet Points, ELI5)
- 👤 User management
- 📚 Summary history tracking
- 🔒 Input validation and error handling

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **AI Service**: IBM watsonx.ai (Granite model)
- **File Processing**: multer, pdf-parse
- **Storage**: In-memory (for demo purposes)

## Project Structure

```
server/
├── src/
│   ├── config/           # Configuration files
│   │   ├── cors.config.js
│   │   ├── multer.config.js
│   │   └── watsonx.config.js
│   ├── controllers/      # Request handlers
│   │   ├── user.controller.js
│   │   ├── document.controller.js
│   │   └── summary.controller.js
│   ├── middleware/       # Express middleware
│   │   ├── errorHandler.js
│   │   ├── logger.js
│   │   └── validateRequest.js
│   ├── routes/          # API routes
│   │   ├── user.routes.js
│   │   ├── document.routes.js
│   │   ├── summary.routes.js
│   │   └── index.js
│   ├── services/        # Business logic
│   │   ├── storage.service.js
│   │   ├── fileParser.service.js
│   │   └── watsonx.service.js
│   ├── utils/           # Utilities
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── prompts.js
│   └── app.js           # Express app setup
├── server.js            # Entry point
├── package.json
├── .env.example
└── README.md
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the server directory:

```bash
cp .env.example .env
```

Edit `.env` and add your IBM Cloud credentials:

```env
WATSONX_API_KEY=your_ibm_cloud_api_key_here
WATSONX_PROJECT_ID=your_watsonx_project_id_here
WATSONX_URL=https://us-south.ml.cloud.ibm.com
PORT=5000
NODE_ENV=development
```

### 3. Get IBM Cloud Credentials

1. Go to [IBM Cloud](https://cloud.ibm.com/)
2. Create a watsonx.ai project
3. Get your API key from IBM Cloud IAM
4. Copy your project ID from watsonx.ai

### 4. Start the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Health Check
- `GET /api/health` - Check API status

### Users
- `POST /api/users` - Create a new user
- `GET /api/users/:userId` - Get user by ID
- `PUT /api/users/:userId` - Update user
- `GET /api/users` - Get all users

### Documents
- `POST /api/documents/upload` - Upload a document
- `GET /api/documents/:documentId` - Get document by ID
- `GET /api/documents/user/:userId` - Get user's documents
- `DELETE /api/documents/:documentId` - Delete document

### Summaries
- `POST /api/summaries/generate` - Generate a summary
- `GET /api/summaries/modes` - Get available summary modes
- `GET /api/summaries/:summaryId` - Get summary by ID
- `GET /api/summaries/user/:userId` - Get user's summaries
- `GET /api/summaries/document/:documentId` - Get document's summaries
- `DELETE /api/summaries/:summaryId` - Delete summary

## API Usage Examples

### Create User
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'
```

### Upload Document
```bash
curl -X POST http://localhost:5000/api/documents/upload \
  -F "file=@document.pdf" \
  -F "userId=user-id-here"
```

### Generate Summary
```bash
curl -X POST http://localhost:5000/api/summaries/generate \
  -H "Content-Type: application/json" \
  -d '{
    "documentId": "doc-id-here",
    "userId": "user-id-here",
    "mode": "tldr"
  }'
```

## Summary Modes

- **tldr** - Quick 2-3 sentence summary
- **detailed** - Comprehensive summary with context
- **bullet_points** - Organized bullet-point list
- **eli5** - Simple explanation for anyone

## Error Handling

The API returns standardized error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

Common error codes:
- `VALIDATION_ERROR` - Invalid input data
- `NOT_FOUND` - Resource not found
- `FILE_PARSE_ERROR` - Failed to parse uploaded file
- `AI_SERVICE_ERROR` - IBM watsonx.ai service error
- `INTERNAL_ERROR` - Server error

## File Upload Limits

- Maximum file size: 10MB
- Supported formats: PDF, TXT
- Files are processed in memory (not saved to disk)

## Development

### Running with Nodemon
```bash
npm run dev
```

### Testing Endpoints
Use tools like:
- Postman
- Thunder Client (VS Code extension)
- curl commands

## Troubleshooting

### "WATSONX_API_KEY is not configured"
- Ensure `.env` file exists in server directory
- Check that environment variables are set correctly
- Restart the server after changing `.env`

### "Failed to parse file"
- Verify file format (PDF or TXT only)
- Check file is not corrupted
- Ensure file size is under 10MB

### "AI Service Error"
- Verify IBM Cloud credentials are correct
- Check watsonx.ai project is active
- Ensure you have API quota available

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production` in `.env`
2. Use a process manager (PM2, systemd)
3. Set up proper logging
4. Configure reverse proxy (nginx)
5. Enable HTTPS
6. Set up monitoring

## License

MIT