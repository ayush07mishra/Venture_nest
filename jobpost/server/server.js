const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Import routes
const jobsRoutes = require('./routes/jobs');
const applicationsRoutes = require('./routes/applications');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/startup-job-board', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('✅ Connected to MongoDB');
})
.catch((err) => {
    console.error('❌ MongoDB connection error:', err);
});

// Routes
app.use('/api/jobs', jobsRoutes);
app.use('/api/applications', applicationsRoutes);

// Serve HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/post', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/post.html'));
});

app.get('/explore', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/explore.html'));
});

app.get('/applications', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/applications.html'));
});

app.get('/my-posts', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/my-posts.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📁 Public files served from: ${path.join(__dirname, '../public')}`);
    console.log(`📁 Uploads served from: ${path.join(__dirname, 'uploads')}`);
}); 