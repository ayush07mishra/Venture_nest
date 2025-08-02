// Job posting functionality
document.addEventListener('DOMContentLoaded', function() {
    const jobForm = document.getElementById('jobForm');
    const successMessage = document.getElementById('successMessage');

    jobForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(jobForm);
        const jobData = {
            jobTitle: formData.get('jobTitle'),
            jobType: formData.get('jobType'),
            jobDescription: formData.get('jobDescription'),
            companyName: formData.get('companyName'),
            location: formData.get('location') || 'Not specified',
            salary: formData.get('salary') || 'Not specified'
        };

        // Validate required fields
        if (!jobData.jobTitle || !jobData.jobType || !jobData.jobDescription || !jobData.companyName) {
            alert('Please fill in all required fields.');
            return;
        }

        // Validate job type
        const validJobTypes = ['Internship', 'Full-time', 'Freelance'];
        if (!validJobTypes.includes(jobData.jobType)) {
            alert('Please select a valid job type.');
            return;
        }

        try {
            // Show loading state
            const submitButton = jobForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Posting Job...';
            submitButton.disabled = true;

            // Send job data to API
            const response = await fetch('/api/jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jobData)
            });

            const result = await response.json();

            if (response.ok) {
                // Hide form and show success message
                jobForm.style.display = 'none';
                successMessage.style.display = 'block';
                
                // Reset form for potential future use
                jobForm.reset();
                
                console.log('Job posted successfully:', result);
                
            } else {
                throw new Error(result.error || 'Failed to post job');
            }
            
        } catch (error) {
            console.error('Error posting job:', error);
            alert(`Error posting job: ${error.message}`);
            
            // Reset button state
            const submitButton = jobForm.querySelector('button[type="submit"]');
            submitButton.textContent = 'Post Job';
            submitButton.disabled = false;
        }
    });

    // Add form validation feedback
    const requiredFields = jobForm.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', function() {
            if (!this.value.trim()) {
                this.style.borderColor = '#dc3545';
            } else {
                this.style.borderColor = '#e1e5e9';
            }
        });
        
        field.addEventListener('input', function() {
            if (this.value.trim()) {
                this.style.borderColor = '#e1e5e9';
            }
        });
    });

    // Add character counter for description
    const descriptionField = document.getElementById('jobDescription');
    if (descriptionField) {
        const counter = document.createElement('div');
        counter.className = 'char-counter';
        counter.style.fontSize = '0.8rem';
        counter.style.color = '#666';
        counter.style.textAlign = 'right';
        counter.style.marginTop = '4px';
        
        descriptionField.parentNode.appendChild(counter);
        
        function updateCounter() {
            const length = descriptionField.value.length;
            counter.textContent = `${length} characters`;
            
            if (length < 50) {
                counter.style.color = '#dc3545';
            } else if (length < 200) {
                counter.style.color = '#ffc107';
            } else {
                counter.style.color = '#28a745';
            }
        }
        
        descriptionField.addEventListener('input', updateCounter);
        updateCounter();
    }
}); 