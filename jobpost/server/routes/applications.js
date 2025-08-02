const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../uploads');
        
        // Create uploads directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Generate unique filename with timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'resume-' + uniqueSuffix + ext);
    }
});

// File filter to only allow PDF and DOC files
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only PDF and DOC files are allowed'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// POST /api/applications/:jobId - Apply to a job with resume upload
router.post('/:jobId', upload.single('resume'), async (req, res) => {
    try {
        const { jobId } = req.params;
        const { applicantName, applicantEmail, applicantPhone, applicantMessage } = req.body;

        // Validate required fields
        if (!applicantName || !applicantEmail) {
            return res.status(400).json({
                error: 'Name and email are required'
            });
        }

        // Check if job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                error: 'Job not found'
            });
        }

        // Check if resume file was uploaded
        if (!req.file) {
            return res.status(400).json({
                error: 'Resume file is required'
            });
        }

        // Create application
        const application = new Application({
            jobId,
            applicantName,
            applicantEmail,
            applicantPhone: applicantPhone || '',
            applicantMessage: applicantMessage || '',
            resumeFile: {
                filename: req.file.filename,
                originalName: req.file.originalname,
                path: req.file.path,
                size: req.file.size
            }
        });

        const savedApplication = await application.save();

        res.status(201).json({
            message: 'Application submitted successfully',
            application: {
                id: savedApplication._id,
                applicantName: savedApplication.applicantName,
                applicantEmail: savedApplication.applicantEmail,
                appliedAt: savedApplication.appliedAt
            }
        });

    } catch (error) {
        console.error('Error submitting application:', error);
        
        // Handle multer errors
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                error: 'File size too large. Maximum size is 5MB.'
            });
        }
        
        if (error.message.includes('Only PDF and DOC files are allowed')) {
            return res.status(400).json({
                error: 'Only PDF and DOC files are allowed'
            });
        }

        res.status(500).json({
            error: 'Failed to submit application'
        });
    }
});

// GET /api/applications/:jobId - Get applications for a specific job
router.get('/:jobId', async (req, res) => {
    try {
        const { jobId } = req.params;

        // Check if job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                error: 'Job not found'
            });
        }

        // Get applications for this job
        const applications = await Application.find({ jobId })
            .sort({ appliedAt: -1 })
            .select('-__v');

        res.json({
            job: {
                id: job._id,
                jobTitle: job.jobTitle,
                companyName: job.companyName
            },
            count: applications.length,
            applications: applications
        });

    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({
            error: 'Failed to fetch applications'
        });
    }
});

// GET /api/applications - Get all applications (for admin purposes)
router.get('/', async (req, res) => {
    try {
        const applications = await Application.find()
            .populate('jobId', 'jobTitle companyName')
            .sort({ appliedAt: -1 })
            .select('-__v');

        res.json({
            count: applications.length,
            applications: applications
        });

    } catch (error) {
        console.error('Error fetching all applications:', error);
        res.status(500).json({
            error: 'Failed to fetch applications'
        });
    }
});

// DELETE /api/applications/:id - Delete an application (for admin purposes)
router.delete('/:id', async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);
        
        if (!application) {
            return res.status(404).json({
                error: 'Application not found'
            });
        }

        // Delete the resume file
        if (application.resumeFile && application.resumeFile.path) {
            const filePath = path.join(__dirname, '../uploads', application.resumeFile.filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        // Delete the application from database
        await Application.findByIdAndDelete(req.params.id);

        res.json({
            message: 'Application deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting application:', error);
        res.status(500).json({
            error: 'Failed to delete application'
        });
    }
});

module.exports = router; 