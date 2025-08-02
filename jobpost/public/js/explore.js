// Job exploration functionality
document.addEventListener('DOMContentLoaded', function() {
    const jobsContainer = document.getElementById('jobsContainer');
    const jobTypeFilter = document.getElementById('jobTypeFilter');
    const noJobsMessage = document.getElementById('noJobsMessage');
    const loadingMessage = document.getElementById('loadingMessage');
    const applicationModal = document.getElementById('applicationModal');
    const modalJobTitle = document.getElementById('modalJobTitle');
    const applicationForm = document.getElementById('applicationForm');
    const closeModal = document.querySelector('.close');

    let currentJobs = [];
    let selectedJobId = null;

    // Load and display jobs
    async function loadJobs() {
        try {
            showLoading(true);
            
            const filterValue = jobTypeFilter.value;
            const url = filterValue ? `/api/jobs?type=${encodeURIComponent(filterValue)}` : '/api/jobs';
            
            const response = await fetch(url);
            const result = await response.json();

            if (response.ok) {
                currentJobs = result.jobs;
                displayJobs(currentJobs);
            } else {
                throw new Error(result.error || 'Failed to fetch jobs');
            }
            
        } catch (error) {
            console.error('Error loading jobs:', error);
            showError('Failed to load jobs. Please try again.');
        } finally {
            showLoading(false);
        }
    }

    // Display jobs in the container
    function displayJobs(jobs) {
        if (jobs.length === 0) {
            jobsContainer.style.display = 'none';
            noJobsMessage.style.display = 'block';
            return;
        }

        jobsContainer.style.display = 'grid';
        noJobsMessage.style.display = 'none';

        jobsContainer.innerHTML = jobs.map(job => `
            <div class="job-card" data-job-id="${job._id}">
                <div class="job-header">
                    <div>
                        <div class="job-title">${escapeHtml(job.jobTitle)}</div>
                        <div class="job-company">${escapeHtml(job.companyName)}</div>
                    </div>
                    <span class="job-type">${escapeHtml(job.jobType)}</span>
                </div>
                
                ${job.location !== 'Not specified' ? `<div class="job-location">📍 ${escapeHtml(job.location)}</div>` : ''}
                ${job.salary !== 'Not specified' ? `<div class="job-salary">💰 ${escapeHtml(job.salary)}</div>` : ''}
                
                <div class="job-description">${escapeHtml(job.jobDescription)}</div>
                
                <button class="job-apply" onclick="openApplicationModal('${job._id}', '${escapeHtml(job.jobTitle)}')">
                    Apply Now
                </button>
            </div>
        `).join('');
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
            jobsContainer.style.display = 'none';
            noJobsMessage.style.display = 'none';
        }
    }

    // Show error message
    function showError(message) {
        jobsContainer.innerHTML = `
            <div class="error-message" style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #dc3545;">
                <h3>Error</h3>
                <p>${message}</p>
                <button onclick="location.reload()" class="btn-primary">Try Again</button>
            </div>
        `;
        jobsContainer.style.display = 'grid';
    }

    // Open application modal
    window.openApplicationModal = function(jobId, jobTitle) {
        selectedJobId = jobId;
        modalJobTitle.textContent = jobTitle;
        applicationModal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    // Close modal
    function closeApplicationModal() {
        applicationModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        selectedJobId = null;
        applicationForm.reset();
    }

    // Handle modal close button
    closeModal.addEventListener('click', closeApplicationModal);

    // Close modal when clicking outside
    applicationModal.addEventListener('click', function(e) {
        if (e.target === applicationModal) {
            closeApplicationModal();
        }
    });

    // Handle application form submission
    applicationForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(applicationForm);
        
        // Validate required fields
        if (!formData.get('applicantName') || !formData.get('applicantEmail')) {
            alert('Please fill in your name and email.');
            return;
        }

        // Validate file upload
        const resumeFile = formData.get('resume');
        if (!resumeFile || resumeFile.size === 0) {
            alert('Please select a resume file.');
            return;
        }

        // Validate file type
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(resumeFile.type)) {
            alert('Please select a valid file type (PDF, DOC, or DOCX).');
            return;
        }

        // Validate file size (5MB)
        if (resumeFile.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB.');
            return;
        }

        try {
            // Show loading state
            const submitButton = applicationForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Submitting...';
            submitButton.disabled = true;

            // Send application data to API
            const response = await fetch(`/api/applications/${selectedJobId}`, {
                method: 'POST',
                body: formData // FormData handles multipart/form-data automatically
            });

            const result = await response.json();

            if (response.ok) {
                // Show success message
                const modalContent = applicationModal.querySelector('.modal-content');
                modalContent.innerHTML = `
                    <div style="text-align: center; padding: 40px;">
                        <h3 style="color: #7b2ff7; margin-bottom: 20px;">✅ Application Sent!</h3>
                        <p style="color: #666; margin-bottom: 30px;">
                            Thank you for your application! We've received your information and will get back to you soon.
                        </p>
                        <button class="btn-primary" onclick="closeApplicationModal()">Close</button>
                    </div>
                `;
                
                // Reset form and close modal after 3 seconds
                setTimeout(() => {
                    closeApplicationModal();
                    // Restore original modal content
                    modalContent.innerHTML = `
                        <span class="close">&times;</span>
                        <h3>Apply for <span id="modalJobTitle"></span></h3>
                        <form id="applicationForm" class="application-form" enctype="multipart/form-data">
                            <div class="form-group">
                                <label for="applicantName">Your Name *</label>
                                <input type="text" id="applicantName" name="applicantName" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="applicantEmail">Email *</label>
                                <input type="email" id="applicantEmail" name="applicantEmail" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="applicantPhone">Phone (optional)</label>
                                <input type="tel" id="applicantPhone" name="applicantPhone">
                            </div>
                            
                            <div class="form-group">
                                <label for="applicantMessage">Why are you interested in this role?</label>
                                <textarea id="applicantMessage" name="applicantMessage" rows="4" placeholder="Tell us about your interest and relevant experience..."></textarea>
                            </div>
                            
                            <div class="form-group">
                                <label for="resume">Resume * (PDF or DOC)</label>
                                <input type="file" id="resume" name="resume" accept=".pdf,.doc,.docx" required>
                                <small>Maximum file size: 5MB. Accepted formats: PDF, DOC, DOCX</small>
                            </div>
                            
                            <button type="submit" class="btn-primary">Submit Application</button>
                        </form>
                    `;
                }, 3000);
                
            } else {
                throw new Error(result.error || 'Failed to submit application');
            }
            
        } catch (error) {
            console.error('Error submitting application:', error);
            alert(`Error submitting application: ${error.message}`);
            
            // Reset button state
            const submitButton = applicationForm.querySelector('button[type="submit"]');
            submitButton.textContent = 'Submit Application';
            submitButton.disabled = false;
        }
    });

    // Global function to close modal
    window.closeApplicationModal = closeApplicationModal;

    // Handle filter change
    jobTypeFilter.addEventListener('change', loadJobs);

    // Initial load
    loadJobs();
}); 