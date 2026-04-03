# AI Document Summarizer - Complete Setup Guide

This guide will walk you through setting up and running the complete AI Document Summarizer application.

## Prerequisites

- Node.js 18+ installed
- IBM Cloud account with watsonx.ai access
- Git (optional)

## Project Structure

```
DesafioTecnico_IBM/
├── client/          # React frontend
├── server/          # Express backend
├── PROJECT_PLAN.md  # Complete project plan
├── QUICK_START.md   # Quick start guide
├── ARCHITECTURE.md  # System architecture
└── README.md        # Project overview
```

## Step 1: Get IBM Cloud Credentials

### 1.1 Create IBM Cloud Account
1. Go to [IBM Cloud](https://cloud.ibm.com/)
2. Sign up or log in

### 1.2 Set Up watsonx.ai
1. Navigate to watsonx.ai in IBM Cloud
2. Create a new project or select an existing one
3. Note your **Project ID** (found in project settings)

### 1.3 Get API Key
1. Go to IBM Cloud Dashboard
2. Navigate to **Manage** → **Access (IAM)** → **API keys**
3. Click **Create an IBM Cloud API key**
4. Copy and save your API key securely

## Step 2: Backend Setup

### 2.1 Install Dependencies

```bash
cd server
npm install
```

### 2.2 Configure Environment Variables

Create `.env` file in the `server` directory:

```bash
# Copy the example file
cp .env.example .env
```

Edit `server/.env` with your credentials:

```env
# IBM watsonx.ai Configuration
WATSONX_API_KEY=your_actual_api_key_here
WATSONX_PROJECT_ID=your_actual_project_id_here
WATSONX_URL=https://us-south.ml.cloud.ibm.com

# Server Configuration
PORT=5000
NODE_ENV=development
```

**Important**: Replace `your_actual_api_key_here` and `your_actual_project_id_here` with your real credentials.

### 2.3 Start Backend Server

```bash
# From server directory
npm run dev
```

You should see:
```
🚀 AI Document Summarizer API Server
📡 Server running on port 5000
🌐 Local: http://localhost:5000
✅ Server is ready to accept requests
```

### 2.4 Test Backend

Open a new terminal and test the health endpoint:

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "AI Document Summarizer API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

## Step 3: Frontend Setup

### 3.1 Install Dependencies

Open a new terminal:

```bash
cd client
npm install
```

### 3.2 Configure Environment (Optional)

The frontend is pre-configured to connect to `http://localhost:5000`. If you changed the backend port, update `client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

### 3.3 Start Frontend

```bash
# From client directory
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

## Step 4: Access the Application

1. Open your browser
2. Navigate to `http://localhost:5173`
3. You should see the AI Document Summarizer homepage

## Step 5: Test the Application

### 5.1 Create a User Profile
1. Click on "Profile" in the navigation
2. Enter your name and email
3. Click "Save Profile"

### 5.2 Upload a Document
1. Go back to the home page
2. Drag and drop a PDF or TXT file, or click to browse
3. Select a summary mode (TL;DR, Detailed, Bullet Points, or ELI5)
4. Click "Generate Summary"

### 5.3 View Results
- The summary will appear below the upload area
- You can generate multiple summaries with different modes
- View your history in the "History" page

## Troubleshooting

### Backend Issues

**Error: "WATSONX_API_KEY is not configured"**
- Ensure `.env` file exists in `server/` directory
- Check that API key is correctly set (no quotes, no spaces)
- Restart the server after changing `.env`

**Error: "Failed to connect to watsonx.ai"**
- Verify your API key is valid
- Check your project ID is correct
- Ensure you have internet connection
- Verify watsonx.ai service is available

**Port 5000 already in use**
- Change PORT in `server/.env` to another port (e.g., 5001)
- Update `client/.env` VITE_API_URL accordingly
- Restart both servers

### Frontend Issues

**Cannot connect to backend**
- Ensure backend server is running on port 5000
- Check `client/.env` has correct API URL
- Verify CORS is enabled (it should be by default)

**Port 5173 already in use**
- Vite will automatically try the next available port
- Or stop the other process using port 5173

**File upload fails**
- Check file size is under 10MB
- Ensure file is PDF or TXT format
- Verify backend is running and accessible

### AI Generation Issues

**Summary generation takes too long**
- IBM watsonx.ai may have rate limits
- Check your internet connection
- Verify your IBM Cloud account has available quota

**Summary quality is poor**
- Try different summary modes
- Ensure document has clear, readable text
- PDF text extraction may vary by PDF quality

## Development Tips

### Running Both Servers

**Option 1: Two Terminals**
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

**Option 2: VS Code Split Terminal**
- Open VS Code integrated terminal
- Click the split terminal icon
- Run backend in one, frontend in the other

### Hot Reload

Both servers support hot reload:
- **Backend**: Changes to `.js` files automatically restart server (nodemon)
- **Frontend**: Changes to `.jsx` files automatically refresh browser (Vite HMR)

### Viewing Logs

**Backend logs** appear in the terminal running `npm run dev` in server directory

**Frontend logs** appear in:
- Terminal running `npm run dev` in client directory
- Browser console (F12 → Console tab)

## Testing API Endpoints

### Using curl

```bash
# Create user
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com"}'

# Upload document
curl -X POST http://localhost:5000/api/documents/upload \
  -F "file=@path/to/document.pdf" \
  -F "userId=user-id-from-previous-response"

# Generate summary
curl -X POST http://localhost:5000/api/summaries/generate \
  -H "Content-Type: application/json" \
  -d '{
    "documentId":"doc-id-from-upload",
    "userId":"user-id",
    "mode":"tldr"
  }'
```

### Using Postman or Thunder Client

1. Import the API endpoints from `PROJECT_PLAN.md` section 5
2. Test each endpoint individually
3. Use the responses to chain requests

## Production Deployment

For production deployment, see:
- `server/README.md` for backend deployment
- `client/README.md` for frontend deployment
- Consider using:
  - Docker containers
  - Cloud platforms (IBM Cloud, AWS, Azure, Vercel)
  - Process managers (PM2)
  - Reverse proxies (nginx)

## Additional Resources

- **PROJECT_PLAN.md** - Complete technical specification
- **QUICK_START.md** - Day-by-day implementation guide
- **ARCHITECTURE.md** - System architecture diagrams
- **server/README.md** - Backend API documentation
- **client/README.md** - Frontend documentation

## Getting Help

If you encounter issues:

1. Check this guide's troubleshooting section
2. Review error messages in terminal/console
3. Verify all environment variables are set correctly
4. Ensure all dependencies are installed
5. Check that both servers are running
6. Review the PROJECT_PLAN.md for detailed specifications

## Summary of Commands

```bash
# Backend setup
cd server
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev

# Frontend setup (new terminal)
cd client
npm install
npm run dev

# Access application
# Open browser to http://localhost:5173
```

## Next Steps

Once everything is running:

1. ✅ Test user profile creation
2. ✅ Upload a sample document
3. ✅ Generate summaries in different modes
4. ✅ Check history page
5. ✅ Explore the UI features
6. 🎥 Record a demo video
7. 📝 Prepare presentation

Good luck with your technical challenge! 🚀