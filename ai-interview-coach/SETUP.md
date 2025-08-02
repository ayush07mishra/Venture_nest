# 🚀 Quick Setup Guide

## Prerequisites
- Node.js (v14 or higher)
- Hugging Face API key (Free account works!)

## 🤖 Free AI Models Available

The app uses free Hugging Face models:
- **DialoGPT-medium** (Default) - Best for interviews
- **GPT-2** - Reliable responses
- **T5-base** - Structured responses
- **BLOOM-560m** - Multilingual
- **DistilGPT2** - Fast responses

## Setup Steps

1. **Get your Hugging Face API key**
   - Go to https://huggingface.co/settings/tokens
   - Create a new token
   - Copy the token

2. **Update the .env file**
   ```bash
   # Edit the .env file and replace with your actual API key
   HUGGINGFACE_API_KEY=your_actual_api_key_here
   ```

3. **Start the application**
   ```bash
   npm start
   ```

4. **Open your browser**
   - Go to http://localhost:3000
   - Upload a PDF resume
   - Start your mock interview!

## Features Implemented ✅

- ✅ PDF resume upload and parsing
- ✅ Hugging Face AI integration (Free models)
- ✅ Role-specific interview questions
- ✅ Chat-style interface
- ✅ Loading spinners and indicators
- ✅ Reset functionality
- ✅ Responsive design
- ✅ File validation (PDF only, 5MB limit)
- ✅ Error handling
- ✅ Modern UI with gradients

## File Structure
```
ai-interview-coach/
├── frontend/
│   ├── index.html      # Main interface
│   ├── style.css       # Modern styling
│   └── script.js       # Frontend logic
├── backend/
│   ├── server.js       # Express server
│   └── ai.js          # AI integration
├── uploads/            # Resume storage
├── package.json        # Dependencies
├── .env               # API key (create this)
└── README.md          # Full documentation
```

## API Endpoints
- `POST /upload-resume` - Upload and parse PDF
- `POST /interview` - Generate AI responses
- `GET /` - Serve the application

## Troubleshooting
- Make sure your API key is valid
- Check that the .env file exists
- Ensure you have Node.js installed
- Verify the uploads directory has write permissions

Happy interviewing! 🎉 