const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

// POST /api/jobs - Create a new job
router.post('/', async (req, res) => {
    try {
        const { jobTitle, jobType, jobDescription, companyName, location, salary } = req.body;

        // Validate required fields
        if (!jobTitle || !jobType || !jobDescription || !companyName) {
            return res.status(400).json({
                error: 'Missing required fields: jobTitle, jobType, jobDescription, companyName'
            });
        }

        // Validate job type
        const validJobTypes = ['Internship', 'Full-time', 'Freelance'];
        if (!validJobTypes.includes(jobType)) {
            return res.status(400).json({
                error: 'Invalid job type. Must be one of: Internship, Full-time, Freelance'
            });
        }

        // Create new job
        const job = new Job({
            jobTitle,
            jobType,
            jobDescription,
            companyName,
            location: location || 'Not specified',
            salary: salary || 'Not specified'
        });

        const savedJob = await job.save();

        res.status(201).json({
            message: 'Job posted successfully',
            job: savedJob
        });

    } catch (error) {
        console.error('Error posting job:', error);
        res.status(500).json({
            error: 'Failed to post job'
        });
    }
});

// GET /api/jobs - Get all jobs (with optional type filter)
router.get('/', async (req, res) => {
    try {
        const { type } = req.query;
        let query = {};

        // Add type filter if provided
        if (type && ['Internship', 'Full-time', 'Freelance'].includes(type)) {
            query.jobType = type;
        }

        // Get jobs sorted by posted date (newest first)
        const jobs = await Job.find(query).sort({ postedAt: -1 });

        res.json({
            count: jobs.length,
            jobs: jobs
        });

    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({
            error: 'Failed to fetch jobs'
        });
    }
});

// GET /api/jobs/:id - Get a specific job by ID
router.get('/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        
        if (!job) {
            return res.status(404).json({
                error: 'Job not found'
            });
        }

        res.json({ job });

    } catch (error) {
        console.error('Error fetching job:', error);
        res.status(500).json({
            error: 'Failed to fetch job'
        });
    }
});

// DELETE /api/jobs/:id - Delete a job (for admin purposes)
router.delete('/:id', async (req, res) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);
        
        if (!job) {
            return res.status(404).json({
                error: 'Job not found'
            });
        }

        res.json({
            message: 'Job deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting job:', error);
        res.status(500).json({
            error: 'Failed to delete job'
        });
    }
});

module.exports = router; 