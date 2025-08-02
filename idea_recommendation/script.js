document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('preferencesForm');
    const resultsSection = document.getElementById('results');
    const loadingSection = document.getElementById('loading');
    const projectCardsContainer = document.getElementById('projectCards');
    const submitBtn = document.querySelector('.submit-btn');

    // Form submission handler
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = {
            Preferred_technologies: formData.get('Preferred_technologies'),
            Domain: formData.get('Domain'),
            Experience_level: formData.get('Experience_level'),
            budget: formData.get('budget')
        };

        // Validate form data
        if (!data.Preferred_technologies || !data.Domain || !data.Experience_level || !data.budget) {
            showError('Please fill in all fields before submitting.');
            return;
        }

        // Show loading state
        showLoading();
        hideResults();
        submitBtn.disabled = true;

        try {
            // Make API request
            const response = await fetch('http://localhost:5000/recommend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            // Hide loading and show results
            hideLoading();
            displayResults(result);
            
        } catch (error) {
            console.error('Error:', error);
            hideLoading();
            showError('Failed to get project recommendations. Please try again.');
        } finally {
            submitBtn.disabled = false;
        }
    });

    // Function to show loading state
    function showLoading() {
        loadingSection.style.display = 'block';
        resultsSection.style.display = 'none';
    }

    // Function to hide loading state
    function hideLoading() {
        loadingSection.style.display = 'none';
    }

    // Function to show results
    function displayResults(data) {
        // Clear previous results
        projectCardsContainer.innerHTML = '';

        // Check if data is an array or has a specific structure
        let projects = [];
        if (Array.isArray(data)) {
            projects = data;
        } else if (data.projects && Array.isArray(data.projects)) {
            projects = data.projects;
        } else if (data.recommendations && Array.isArray(data.recommendations)) {
            projects = data.recommendations;
        } else {
            // If data is a single object, wrap it in an array
            projects = [data];
        }

        if (projects.length === 0) {
            showError('No project recommendations found. Please try different preferences.');
            return;
        }

        // Create project cards
        projects.forEach(project => {
            const card = createProjectCard(project);
            projectCardsContainer.appendChild(card);
        });

        // Show results section
        resultsSection.style.display = 'block';
        
        // Smooth scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Function to create a project card
    function createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card';

        const projectName = project.Project_name || project.project_name || project.name || 'Project Name';
        const description = project.description || project.Description || 'No description available.';
        const industry = project.industry || project.Industry || 'General';

        card.innerHTML = `
            <h3 class="project-name">${escapeHtml(projectName)}</h3>
            <p class="project-description">${escapeHtml(description)}</p>
            <span class="project-industry">${escapeHtml(industry)}</span>
        `;

        return card;
    }

    // Function to show error message
    function showError(message) {
        // Remove existing error messages
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Create error message element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;

        // Insert error message before the form
        const formCard = document.querySelector('.form-card');
        formCard.insertBefore(errorDiv, formCard.firstChild);

        // Auto-remove error message after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }

    // Function to show success message
    function showSuccess(message) {
        // Remove existing success messages
        const existingSuccess = document.querySelector('.success-message');
        if (existingSuccess) {
            existingSuccess.remove();
        }

        // Create success message element
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;

        // Insert success message before the form
        const formCard = document.querySelector('.form-card');
        formCard.insertBefore(successDiv, formCard.firstChild);

        // Auto-remove success message after 5 seconds
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.remove();
            }
        }, 5000);
    }

    // Function to hide results
    function hideResults() {
        resultsSection.style.display = 'none';
    }

    // Function to escape HTML to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Add smooth transitions for better UX
    const dropdowns = document.querySelectorAll('select');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('change', function() {
            // Remove any existing error messages when user makes changes
            const existingError = document.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
        });
    });

    // Add keyboard navigation support
    form.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target.tagName !== 'SELECT') {
            e.preventDefault();
            form.dispatchEvent(new Event('submit'));
        }
    });

    // Add form validation feedback
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', function() {
            if (!this.value) {
                this.style.borderColor = '#dc2626';
            } else {
                this.style.borderColor = '#d1d5db';
            }
        });

        field.addEventListener('input', function() {
            if (this.value) {
                this.style.borderColor = '#d1d5db';
            }
        });
    });
}); 