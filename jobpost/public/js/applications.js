// Applications management functionality
document.addEventListener('DOMContentLoaded', function() {
    const applicationsContainer = document.getElementById('applicationsContainer');
    const jobFilter = document.getElementById('jobFilter');
    const noApplicationsMessage = document.getElementById('noApplicationsMessage');
    const loadingMessage = document.getElementById('loadingMessage');
    const applicationModal = document.getElementById('applicationModal');
    const applicationDetails = document.getElementById('applicationDetails');
    const closeModal = document.querySelector('.close');

    let allApplications = [];
    let allJobs = [];

    // Load all applications and jobs
    async function loadApplications() {
        try {
            showLoading(true);
            
            // Load all applications
            const applicationsResponse = await fetch('/api/applications');
            const applicationsResult = await applicationsResponse.json();

            if (!applicationsResponse.ok) {
                throw new Error(applicationsResult.error || 'Failed to fetch applications');
            }

            allApplications = applicationsResult.applications;

            // Load all jobs for filter dropdown
            const jobsResponse = await fetch('/api/jobs');
            const jobsResult = await jobsResponse.json();

            if (!jobsResponse.ok) {
                throw new Error(jobsResult.error || 'Failed to fetch jobs');
            }

            allJobs = jobsResult.jobs;
            
            // Populate job filter dropdown
            populateJobFilter();
            
            // Display applications
            displayApplications(allApplications);
            
        } catch (error) {
            console.error('Error loading applications:', error);
            showError('Failed to load applications. Please try again.');
        } finally {
            showLoading(false);
        }
    }

    // Populate job filter dropdown
    function populateJobFilter() {
        jobFilter.innerHTML = '<option value="">All Jobs</option>';
        
        allJobs.forEach(job => {
            const option = document.createElement('option');
            option.value = job._id;
            option.textContent = `${job.jobTitle} - ${job.companyName}`;
            jobFilter.appendChild(option);
        });
    }

    // Display applications in the container
    function displayApplications(applications) {
        if (applications.length === 0) {
            applicationsContainer.style.display = 'none';
            noApplicationsMessage.style.display = 'block';
            return;
        }

        applicationsContainer.style.display = 'grid';
        noApplicationsMessage.style.display = 'none';

        applicationsContainer.innerHTML = applications.map(application => {
            const job = allJobs.find(j => j._id === application.jobId) || {};
            const appliedDate = new Date(application.appliedAt).toLocaleDateString();
            
            return `
                <div class="application-card" data-application-id="${application._id}">
                    <div class="application-header">
                        <div>
                            <div class="applicant-name">${escapeHtml(application.applicantName)}</div>
                            <div class="applicant-email">📧 ${escapeHtml(application.applicantEmail)}</div>
                        </div>
                        <div class="application-date">${appliedDate}</div>
                    </div>
                    
                    ${application.applicantPhone ? `<div class="applicant-phone">📞 ${escapeHtml(application.applicantPhone)}</div>` : ''}
                    
                    ${application.applicantMessage ? `<div class="applicant-message">"${escapeHtml(application.applicantMessage)}"</div>` : ''}
                    
                    <div style="margin-bottom: 15px;">
                        <strong>Applied for:</strong> ${escapeHtml(job.jobTitle || 'Unknown Job')} 
                        ${job.companyName ? `at ${escapeHtml(job.companyName)}` : ''}
                    </div>
                    
                    <div class="application-actions">
                        <button class="btn-secondary" onclick="viewApplicationDetails('${application._id}')">
                            View Details
                        </button>
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
            applicationsContainer.style.display = 'none';
            noApplicationsMessage.style.display = 'none';
        }
    }

    // Show error message
    function showError(message) {
        applicationsContainer.innerHTML = `
            <div class="error-message" style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #dc3545;">
                <h3>Error</h3>
                <p>${message}</p>
                <button onclick="location.reload()" class="btn-primary">Try Again</button>
            </div>
        `;
        applicationsContainer.style.display = 'grid';
    }

    // View application details in modal
    window.viewApplicationDetails = function(applicationId) {
        const application = allApplications.find(app => app._id === applicationId);
        const job = allJobs.find(j => j._id === application.jobId) || {};
        
        if (!application) {
            alert('Application not found');
            return;
        }

        const appliedDate = new Date(application.appliedAt).toLocaleString();
        
        applicationDetails.innerHTML = `
            <h4>Application Details</h4>
            <div class="application-details">
                <p><strong>Applicant Name:</strong> ${escapeHtml(application.applicantName)}</p>
                <p><strong>Email:</strong> ${escapeHtml(application.applicantEmail)}</p>
                ${application.applicantPhone ? `<p><strong>Phone:</strong> ${escapeHtml(application.applicantPhone)}</p>` : ''}
                <p><strong>Applied Date:</strong> ${appliedDate}</p>
                <p><strong>Job Title:</strong> ${escapeHtml(job.jobTitle || 'Unknown')}</p>
                <p><strong>Company:</strong> ${escapeHtml(job.companyName || 'Unknown')}</p>
                ${application.applicantMessage ? `<p><strong>Message:</strong> "${escapeHtml(application.applicantMessage)}"</p>` : ''}
                <p><strong>Resume File:</strong> ${escapeHtml(application.resumeFile.originalName)}</p>
                <p><strong>File Size:</strong> ${(application.resumeFile.size / 1024).toFixed(1)} KB</p>
                
                <div style="margin-top: 20px;">
                    <a href="/uploads/${application.resumeFile.filename}" 
                       class="btn-primary" 
                       target="_blank" 
                       download="${application.resumeFile.originalName}">
                        📄 Download Resume
                    </a>
                </div>
            </div>
        `;
        
        applicationModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    // Close modal
    function closeApplicationModal() {
        applicationModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Handle modal close button
    closeModal.addEventListener('click', closeApplicationModal);

    // Close modal when clicking outside
    applicationModal.addEventListener('click', function(e) {
        if (e.target === applicationModal) {
            closeApplicationModal();
        }
    });

    // Handle job filter change
    jobFilter.addEventListener('change', function() {
        const selectedJobId = this.value;
        
        if (!selectedJobId) {
            // Show all applications
            displayApplications(allApplications);
        } else {
            // Filter applications by job
            const filteredApplications = allApplications.filter(app => app.jobId === selectedJobId);
            displayApplications(filteredApplications);
        }
    });

    // Global function to close modal
    window.closeApplicationModal = closeApplicationModal;

    // Initial load
    loadApplications();
}); 