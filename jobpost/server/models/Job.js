const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    jobTitle: {
        type: String,
        required: [true, 'Job title is required'],
        trim: true
    },
    jobType: {
        type: String,
        required: [true, 'Job type is required'],
        enum: ['Internship', 'Full-time', 'Freelance'],
        default: 'Full-time'
    },
    jobDescription: {
        type: String,
        required: [true, 'Job description is required'],
        trim: true
    },
    companyName: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true
    },
    location: {
        type: String,
        default: 'Not specified',
        trim: true
    },
    salary: {
        type: String,
        default: 'Not specified',
        trim: true
    },
    postedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Add index for better query performance
jobSchema.index({ jobType: 1, postedAt: -1 });

module.exports = mongoose.model('Job', jobSchema); 