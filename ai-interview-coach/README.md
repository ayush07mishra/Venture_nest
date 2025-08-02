# AI Interview Coach

A full-stack web application that provides AI-powered mock interviews based on your resume. Upload your PDF resume and practice with an intelligent interview coach that asks relevant questions and provides feedback.

## 🚀 Features

- **PDF Resume Upload**: Upload your resume in PDF format
- **AI-Powered Interviews**: Uses Hugging Face's Mistral-7B-Instruct model
- **Role-Specific Questions**: Choose from different job roles (SDE, PM, Data Analyst, etc.)
- **Real-time Feedback**: Get scores and improvement tips after each answer
- **Chat Interface**: Modern, responsive chat-style interface
- **Loading Indicators**: Visual feedback during AI processing
- **Reset Functionality**: Start over with a new resume anytime

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, JavaScript (vanilla)
- **Backend**: Node.js with Express.js
- **AI Model**: Hugging Face Inference API (Free models available)
- **File Processing**: pdf-parse for PDF text extraction
- **File Upload**: Multer for handling file uploads

### 🤖 AI Models & Fallback System

The application uses a smart fallback system:

1. **Primary**: Hugging Face AI models (when available)
2. **Fallback**: Intelligent Mock AI system (always works)

**Available Models:**
- **GPT-2** (Default) - Text generation model
- **GPT-2-Medium** - Better quality responses
- **Mock AI** - Intelligent fallback with role-specific questions

**Features:**
- ✅ Always works (mock AI fallback)
- ✅ Role-specific interview questions
- ✅ Realistic feedback and scoring
- ✅ Progressive interview flow
- ✅ Final summary with strengths/improvements

To change models, set the `AI_MODEL` environment variable:
```bash
AI_MODEL=gpt2Medium  # Use GPT-2 Medium
```

## 📁 Project Structure

```
ai-interview-coach/
├── frontend/
│   ├── index.html      # Main HTML file
│   ├── style.css       # Styling
│   └── script.js       # Frontend JavaScript
├── backend/
│   ├── server.js       # Express server
│   └── ai.js          # AI integration
├── uploads/            # Resume PDF storage
├── package.json        # Dependencies
└── README.md          # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Hugging Face API key

### Installation

1. **Clone or download the project**
   ```bash
   cd ai-interview-coach
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```bash
   # Create .env file
   touch .env
   ```
   
   Add your Hugging Face API key:
   ```
   HUGGINGFACE_API_KEY=your_huggingface_api_key_here
   PORT=3000
   ```

4. **Get your Hugging Face API key**
   - Go to [Hugging Face](https://huggingface.co/settings/tokens)
   - Create a new token
   - Copy the token to your `.env` file

5. **Start the application**
   ```bash
   npm start
   ```

6. **Open your browser**
   - Navigate to `http://localhost:3000`
   - Upload your PDF resume and start practicing!

## 🎯 How to Use

1. **Upload Resume**: Click "Choose PDF Resume" and select your resume file
2. **Select Role**: Choose your target job role from the dropdown
3. **Start Interview**: Click "Start My Mock Interview" to begin
4. **Answer Questions**: Respond to AI questions in the chat interface
5. **Get Feedback**: Receive scores and improvement tips after each answer
6. **Review Summary**: Get a final summary with overall score and areas to improve

## 🔧 API Endpoints

- `POST /upload-resume`: Upload and parse PDF resume
- `POST /interview`: Generate AI interview responses
- `GET /`: Serve the main application

## 🎨 Features

### Upload Interface
- Clean, modern design with gradient background
- File validation (PDF only, max 5MB)
- Resume content preview
- Role selection dropdown

### Chat Interface
- Real-time messaging
- Typing indicators
- Auto-scroll to latest messages
- Responsive design

### AI Integration
- Context-aware questions based on resume
- Progressive feedback system
- Role-specific interview questions
- Final summary with scoring

## 🔒 Security

- File size limits (5MB max)
- File type validation (PDF only)
- Environment variable protection
- CORS enabled for development

## 🚀 Deployment

### Local Development
```bash
npm run dev  # Uses nodemon for auto-restart
```

### Production
```bash
npm start
```

## 🐛 Troubleshooting

### Common Issues

1. **API Key Error**
   - Ensure your `.env` file exists and contains the correct API key
   - Verify the API key is valid on Hugging Face

2. **File Upload Issues**
   - Check file size (must be < 5MB)
   - Ensure file is PDF format
   - Verify uploads directory has write permissions

3. **AI Response Errors**
   - Check internet connection
   - Verify Hugging Face API is accessible
   - Check API rate limits

## 📝 License

MIT License - feel free to use this project for your own applications!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

If you encounter any issues or have questions, please open an issue on the repository.

---

**Happy Interviewing! 🎉** 