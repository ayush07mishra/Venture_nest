const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { parseResume } = require('./ai');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.pdf');
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Upload resume endpoint
app.post('/upload-resume', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const resumePath = req.file.path;
    const resumeContent = await parseResume(resumePath);

    res.json({
      success: true,
      message: 'Resume uploaded and parsed successfully',
      resumeContent: resumeContent,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Error uploading resume:', error);
    res.status(500).json({ error: 'Error processing resume' });
  }
});

// AI interview endpoint
app.post('/interview', async (req, res) => {
  try {
    const { resumeContent, userMessage, conversationHistory, role } = req.body;
    
    if (!resumeContent) {
      return res.status(400).json({ error: 'Resume content is required' });
    }

    const aiResponse = await generateInterviewResponse(resumeContent, userMessage, conversationHistory, role);
    
    res.json({
      success: true,
      response: aiResponse
    });
  } catch (error) {
    console.error('Error in interview:', error);
    res.status(500).json({ error: 'Error generating AI response' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`AI Interview Coach server running on http://localhost:${PORT}`);
});

// Helper function to generate AI interview response
async function generateInterviewResponse(resumeContent, userMessage, conversationHistory, role) {
  try {
    const response = await require('./ai').generateInterviewResponse(resumeContent, userMessage, conversationHistory, role);
    return response;
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw error;
  }
} 