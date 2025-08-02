const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: [true, 'Job ID is required']
    },
    applicantName: {
        type: String,
        required: [true, 'Applicant name is required'],
        trim: true
    },
    applicantEmail: {
        type: String,
        required: [true, 'Applicant email is required'],
        trim: true,
        lowercase: true
    },
    applicantPhone: {
        type: String,
        trim: true
    },
    applicantMessage: {
        type: String,
        trim: true
    },
    resumeFile: {
        filename: {
            type: String,
            required: [true, 'Resume filename is required']
        },
        originalName: {
            type: String,
            required: [true, 'Original filename is required']
        },
        path: {
            type: String,
            required: [true, 'File path is required']
        },
        size: {
            type: Number,
            required: [true, 'File size is required']
        }
    },
    appliedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Add indexes for better query performance
applicationSchema.index({ jobId: 1, appliedAt: -1 });
applicationSchema.index({ applicantEmail: 1 });

module.exports = mongoose.model('Application', applicationSchema); 