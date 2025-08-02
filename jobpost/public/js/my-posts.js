// My Recent Posts functionality
document.addEventListener('DOMContentLoaded', function() {
    const myPostsContainer = document.getElementById('myPostsContainer');
    const noPostsMessage = document.getElementById('noPostsMessage');
    const loadingMessage = document.getElementById('loadingMessage');
    const jobDetailsModal = document.getElementById('jobDetailsModal');
    const applicationsModal = document.getElementById('applicationsModal');
    const jobDetails = document.getElementById('jobDetails');
    const applicationsList = document.getElementById('applicationsList');
    const modalJobTitle = document.getElementById('modalJobTitle');
    const closeModals = document.querySelectorAll('.close');

    let allJobs = [];
    let allApplications = [];

    // Load all jobs and applications
    async function loadMyPosts() {
        try {
            showLoading(true);
            
            // Load all jobs (in a real app, you'd filter by employer)
            const jobsResponse = await fetch('/api/jobs');
            const jobsResult = await jobsResponse.json();

            if (!jobsResponse.ok) {
                throw new Error(jobsResult.error || 'Failed to fetch jobs');
            }

            allJobs = jobsResult.jobs;

            // Load all applications
            const applicationsResponse = await fetch('/api/applications');
            const applicationsResult = await applicationsResponse.json();

            if (!applicationsResponse.ok) {
                throw new Error(applicationsResult.error || 'Failed to fetch applications');
            }

            allApplications = applicationsResult.applications;
            
            // Display job posts
            displayMyPosts(allJobs);
            
        } catch (error) {
            console.error('Error loading my posts:', error);
            showError('Failed to load your job posts. Please try again.');
        } finally {
            showLoading(false);
        }
    }

    // Display job posts in the container
    function displayMyPosts(jobs) {
        if (jobs.length === 0) {
            myPostsContainer.style.display = 'none';
            noPostsMessage.style.display = 'block';
            return;
        }

        myPostsContainer.style.display = 'grid';
        noPostsMessage.style.display = 'none';

        myPostsContainer.innerHTML = jobs.map(job => {
            const applicationsForJob = allApplications.filter(app => app.jobId === job._id);
            const postedDate = new Date(job.postedAt).toLocaleDateString();
            
            return `
                <div class="my-post-card" data-job-id="${job._id}">
                    <div class="my-post-header">
                        <div>
                            <div class="my-post-title">${escapeHtml(job.jobTitle)}</div>
                            <div class="my-post-company">${escapeHtml(job.companyName)}</div>
                        </div>
                        <span class="my-post-type">${escapeHtml(job.jobType)}</span>
                    </div>
                    
                    ${job.location !== 'Not specified' ? `<div class="my-post-location">📍 ${escapeHtml(job.location)}</div>` : ''}
                    ${job.salary !== 'Not specified' ? `<div class="my-post-salary">💰 ${escapeHtml(job.salary)}</div>` : ''}
                    
                    <div class="my-post-description">${escapeHtml(job.jobDescription)}</div>
                    
                    <div class="my-post-stats">
                        <div class="my-post-stat">
                            <span class="my-post-stat-number">${applicationsForJob.length}</span>
                            <span class="my-post-stat-label">Applications</span>
                        </div>
                        <div class="my-post-stat">
                            <span class="my-post-stat-number">${postedDate}</span>
                            <span class="my-post-stat-label">Posted</span>
                        </div>
                    </div>
                    
                    <div class="my-post-actions">
                        <button class="btn-secondary" onclick="viewJobDetails('${job._id}')">
                            View Details
                        </button>
                        <button class="btn-primary" onclick="viewApplications('${job._id}', '${escapeHtml(job.jobTitle)}')">
                            View Applications (${applicationsForJob.length})
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Show/hide loading message
    function showLoading(show) {
        loadingMessage.style.display = show ? 'block' : 'none';
        if (show) {
            myPostsContainer.style.display = 'none';
            noPostsMessage.style.display = 'none';
        }
    }

    // Show error message
    function showError(message) {
        myPostsContainer.innerHTML = `
            <div class="error-message" style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #dc3545;">
                <h3>Error</h3>
                <p>${message}</p>
                <button onclick="location.reload()" class="btn-primary">Try Again</button>
            </div>
        `;
        myPostsContainer.style.display = 'grid';
    }

    // View job details in modal
    window.viewJobDetails = function(jobId) {
        const job = allJobs.find(j => j._id === jobId);
        
        if (!job) {
            alert('Job not found');
            return;
        }

        const postedDate = new Date(job.postedAt).toLocaleString();
        
        jobDetails.innerHTML = `
            <h4>Job Details</h4>
            <div class="application-details">
                <p><strong>Job Title:</strong> ${escapeHtml(job.jobTitle)}</p>
                <p><strong>Company:</strong> ${escapeHtml(job.companyName)}</p>
                <p><strong>Job Type:</strong> ${escapeHtml(job.jobType)}</p>
                <p><strong>Location:</strong> ${escapeHtml(job.location)}</p>
                <p><strong>Salary:</strong> ${escapeHtml(job.salary)}</p>
                <p><strong>Posted Date:</strong> ${postedDate}</p>
                <p><strong>Description:</strong></p>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 10px;">
                    ${escapeHtml(job.jobDescription)}
                </div>
            </div>
        `;
        
        jobDetailsModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    // View applications for a specific job
    window.viewApplications = async function(jobId, jobTitle) {
        try {
            modalJobTitle.textContent = jobTitle;
            
            // Get applications for this specific job
            const response = await fetch(`/api/applications/${jobId}`);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to fetch applications');
            }

            const applications = result.applications;

            if (applications.length === 0) {
                applicationsList.innerHTML = `
                    <div style="text-align: center; padding: 40px; color: #666;">
                        <h4>No applications yet</h4>
                        <p>This job hasn't received any applications yet. Keep promoting your job posting!</p>
                    </div>
                `;
            } else {
                applicationsList.innerHTML = applications.map(application => {
                    const appliedDate = new Date(application.appliedAt).toLocaleString();
                    
                    return `
                        <div class="application-card" style="margin-bottom: 20px;">
                            <div class="application-header">
                                <div>
                                    <div class="applicant-name">${escapeHtml(application.applicantName)}</div>
                                    <div class="applicant-email">📧 ${escapeHtml(application.applicantEmail)}</div>
                                </div>
                                <div class="application-date">${appliedDate}</div>
                            </div>
                            
                            ${application.applicantPhone ? `<div class="applicant-phone">📞 ${escapeHtml(application.applicantPhone)}</div>` : ''}
                            
                            ${application.applicantMessage ? `<div class="applicant-message">"${escapeHtml(application.applicantMessage)}"</div>` : ''}
                            
                            <div class="application-actions">
                                <a href="/uploads/${application.resumeFile.filename}" 
                                   class="btn-primary" 
                                   target="_blank" 
                                   download="${application.resumeFile.originalName}">
                                    📄 Download Resume
                                </a>
                            </div>
                        </div>
                    `;
                }).join('');
            }
            
            applicationsModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
        } catch (error) {
            console.error('Error loading applications:', error);
            alert(`Error loading applications: ${error.message}`);
        }
    }

    // Close modals
    function closeAllModals() {
        jobDetailsModal.style.display = 'none';
        applicationsModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Handle modal close buttons
    closeModals.forEach(closeBtn => {
        closeBtn.addEventListener('click', closeAllModals);
    });

    // Close modals when clicking outside
    jobDetailsModal.addEventListener('click', function(e) {
        if (e.target === jobDetailsModal) {
            closeAllModals();
        }
    });

    applicationsModal.addEventListener('click', function(e) {
        if (e.target === applicationsModal) {
            closeAllModals();
        }
    });

    // Initial load
    loadMyPosts();
}); 