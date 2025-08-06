// Global variables
let projects = [];
let filteredProjects = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize theme
    initializeTheme();
    
    // Load posted projects from localStorage
    loadPostedProjects();
    
    // Handle form submission for posting projects
    const postProjectForm = document.getElementById('postProjectForm');
    if (postProjectForm) {
        postProjectForm.addEventListener('submit', handleProjectSubmission);
    }

    // Handle search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    // Handle buy buttons
    setupBuyButtons();

    // Initialize tooltips and other UI elements
    initializeUI();
}

// Initialize theme functionality
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Set initial theme
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

// Toggle theme
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

// Update theme icon
function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
            themeToggle.title = 'Switch to Light Mode';
        } else {
            icon.className = 'fas fa-moon';
            themeToggle.title = 'Switch to Dark Mode';
        }
    }
}

// Load posted projects from localStorage
function loadPostedProjects() {
    const postedProjects = JSON.parse(localStorage.getItem('marketplaceProjects') || '[]');
    const projectsGrid = document.getElementById('projectsGrid');
    
    if (projectsGrid && postedProjects.length > 0) {
        postedProjects.forEach(project => {
            const projectCard = createProjectCardFromPosted(project);
            projectsGrid.appendChild(projectCard);
        });
    }
}

// Create project card from posted project data
function createProjectCardFromPosted(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.dataset.category = project.category || 'other';
    card.dataset.price = project.price;
    
    const tags = project.tags ? project.tags.split(',').map(tag => tag.trim()) : [];
    const tagHtml = tags.map(tag => `<span class="tag">${tag}</span>`).join('');
    
    card.innerHTML = `
        <div class="project-image">
            <i class="fas fa-image"></i>
            <span class="price-tag">$${project.price}</span>
        </div>
        <div class="project-content">
            <h3 class="project-title">${project.title}</h3>
            <p class="project-creator">by ${project.creatorName}</p>
            <p class="project-description">${project.description}</p>
            <div class="project-tags">
                ${tagHtml}
            </div>
            <div class="project-stats">
                <div class="rating">
                    <i class="fas fa-star"></i>
                    <span>4.5</span>
                </div>
                <div class="views">
                    <i class="fas fa-eye"></i>
                    <span>0</span>
                </div>
            </div>
            <button class="btn btn-buy" onclick="buyProject('${project.title}', ${project.price})">
                <i class="fas fa-shopping-cart"></i>
                Buy Now
            </button>
        </div>
    `;
    
    return card;
}

// Handle project submission
function handleProjectSubmission(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const projectData = {
        title: formData.get('projectTitle') || document.getElementById('projectTitle')?.value,
        description: formData.get('projectDescription') || document.getElementById('projectDescription')?.value,
        category: formData.get('projectCategory') || document.getElementById('projectCategory')?.value,
        price: parseFloat(formData.get('projectPrice') || document.getElementById('projectPrice')?.value),
        tags: formData.get('projectTags') || document.getElementById('projectTags')?.value,
        technologies: formData.get('projectTechnologies') || document.getElementById('projectTechnologies')?.value,
        creatorName: formData.get('creatorName') || document.getElementById('creatorName')?.value,
        creatorEmail: formData.get('creatorEmail') || document.getElementById('creatorEmail')?.value,
        demoUrl: formData.get('projectDemo') || document.getElementById('projectDemo')?.value,
        documentation: formData.get('projectDocumentation') || document.getElementById('projectDocumentation')?.value,
        license: formData.get('projectLicense') || document.getElementById('projectLicense')?.value,
        terms: formData.get('projectTerms') || document.getElementById('projectTerms')?.value,
        features: {
            support: document.getElementById('featureSupport')?.checked || false,
            updates: document.getElementById('featureUpdates')?.checked || false,
            customization: document.getElementById('featureCustomization')?.checked || false,
            sourceCode: document.getElementById('featureSourceCode')?.checked || false
        },
        timestamp: new Date().toISOString()
    };

    // Validate required fields
    if (!projectData.title || !projectData.description || !projectData.category || !projectData.price || !projectData.creatorName || !projectData.creatorEmail) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }

    // Validate price
    if (projectData.price <= 0) {
        showNotification('Price must be greater than 0.', 'error');
        return;
    }

    // Simulate project submission
    submitProject(projectData);
}

// Submit project to backend (simulated)
function submitProject(projectData) {
    // Show loading state
    const submitButton = document.querySelector('#postProjectForm button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitButton.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Store in localStorage for demo purposes
        const existingProjects = JSON.parse(localStorage.getItem('marketplaceProjects') || '[]');
        projectData.id = Date.now().toString();
        existingProjects.push(projectData);
        localStorage.setItem('marketplaceProjects', JSON.stringify(existingProjects));

        // Reset form
        document.getElementById('postProjectForm').reset();

        // Show success message
        showNotification('Project submitted successfully! It will be reviewed and published soon.', 'success');

        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;

        // Redirect to browse page after a short delay
        setTimeout(() => {
            window.location.href = 'browse-projects.html';
        }, 2000);

    }, 2000);
}

// Handle search functionality
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        const title = card.querySelector('.project-title').textContent.toLowerCase();
        const description = card.querySelector('.project-description').textContent.toLowerCase();
        const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
        const creator = card.querySelector('.project-creator').textContent.toLowerCase();
        
        const matchesSearch = title.includes(searchTerm) || 
                            description.includes(searchTerm) || 
                            tags.some(tag => tag.includes(searchTerm)) ||
                            creator.includes(searchTerm);
        
        card.style.display = matchesSearch ? 'block' : 'none';
    });
}

// Apply filters
function applyFilters() {
    const categoryFilter = document.getElementById('categoryFilter')?.value;
    const priceFilter = document.getElementById('priceFilter')?.value;
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase();
    
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        const category = card.dataset.category;
        const price = parseFloat(card.dataset.price);
        const title = card.querySelector('.project-title').textContent.toLowerCase();
        const description = card.querySelector('.project-description').textContent.toLowerCase();
        const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
        const creator = card.querySelector('.project-creator').textContent.toLowerCase();
        
        // Check category filter
        const matchesCategory = !categoryFilter || category === categoryFilter;
        
        // Check price filter
        let matchesPrice = true;
        if (priceFilter) {
            const [min, max] = priceFilter.split('-').map(p => p === '+' ? Infinity : parseFloat(p));
            matchesPrice = price >= min && (max === Infinity ? true : price <= max);
        }
        
        // Check search term
        const matchesSearch = !searchTerm || 
                            title.includes(searchTerm) || 
                            description.includes(searchTerm) || 
                            tags.some(tag => tag.includes(searchTerm)) ||
                            creator.includes(searchTerm);
        
        card.style.display = (matchesCategory && matchesPrice && matchesSearch) ? 'block' : 'none';
    });
}

// Buy project functionality
function buyProject(projectName, price) {
    // Show purchase modal
    showPurchaseModal(projectName, price);
}

// Show purchase modal
function showPurchaseModal(projectName, price) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Purchase Project</h3>
                <button class="modal-close" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <p>You are about to purchase: <strong>${projectName}</strong></p>
                <p>Price: <strong>$${price}</strong></p>
                <div class="payment-methods">
                    <h4>Select Payment Method:</h4>
                    <label class="payment-option">
                        <input type="radio" name="payment" value="card" checked>
                        <span>Credit/Debit Card</span>
                    </label>
                    <label class="payment-option">
                        <input type="radio" name="payment" value="paypal">
                        <span>PayPal</span>
                    </label>
                    <label class="payment-option">
                        <input type="radio" name="payment" value="crypto">
                        <span>Cryptocurrency</span>
                    </label>
                </div>
                <div class="card-details" id="cardDetails">
                    <h4>Card Details:</h4>
                    <input type="text" placeholder="Card Number" class="form-input">
                    <div class="form-row">
                        <input type="text" placeholder="MM/YY" class="form-input">
                        <input type="text" placeholder="CVV" class="form-input">
                    </div>
                    <input type="text" placeholder="Cardholder Name" class="form-input">
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button class="btn btn-primary" onclick="processPurchase('${projectName}', ${price})">
                    <i class="fas fa-lock"></i>
                    Pay $${price}
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        }
        .modal-content {
            background: var(--bg-secondary);
            border-radius: 16px;
            max-width: 500px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            border: 1px solid var(--border-color);
        }
        .modal-header {
            padding: 20px;
            border-bottom: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .modal-header h3 {
            color: var(--text-primary);
        }
        .modal-close {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: var(--text-secondary);
        }
        .modal-body {
            padding: 20px;
            color: var(--text-primary);
        }
        .modal-footer {
            padding: 20px;
            border-top: 1px solid var(--border-color);
            display: flex;
            gap: 10px;
            justify-content: flex-end;
        }
        .payment-methods {
            margin: 20px 0;
        }
        .payment-option {
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 10px 0;
            cursor: pointer;
            color: var(--text-primary);
        }
        .card-details {
            margin-top: 20px;
            padding: 20px;
            background: var(--bg-primary);
            border-radius: 8px;
            border: 1px solid var(--border-color);
        }
    `;
    document.head.appendChild(style);
}

// Close modal
function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

// Process purchase
function processPurchase(projectName, price) {
    const submitButton = document.querySelector('.modal-footer .btn-primary');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitButton.disabled = true;

    // Simulate payment processing
    setTimeout(() => {
        showNotification(`Successfully purchased ${projectName} for $${price}!`, 'success');
        closeModal();
        
        // In a real application, you would redirect to a download page or send files via email
        setTimeout(() => {
            alert('Thank you for your purchase! You will receive the project files via email shortly.');
        }, 1000);
    }, 2000);
}

// Load more projects
function loadMoreProjects() {
    const loadMoreButton = document.querySelector('.btn-outline');
    const originalText = loadMoreButton.innerHTML;
    loadMoreButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    loadMoreButton.disabled = true;

    // Simulate loading more projects
    setTimeout(() => {
        // Add more sample projects
        const projectsGrid = document.getElementById('projectsGrid');
        const newProjects = [
            {
                title: 'Weather App Template',
                creator: 'WeatherPro',
                description: 'Beautiful weather application with location-based forecasts',
                price: 59,
                category: 'mobile-apps',
                tags: ['Weather', 'Mobile', 'API'],
                rating: 4.4,
                views: 123
            },
            {
                title: 'Blog CMS System',
                creator: 'ContentMasters',
                description: 'Complete content management system for blogs and websites',
                price: 99,
                category: 'web-development',
                tags: ['CMS', 'Blog', 'Admin'],
                rating: 4.6,
                views: 89
            }
        ];

        newProjects.forEach(project => {
            const projectCard = createProjectCard(project);
            projectsGrid.appendChild(projectCard);
        });

        loadMoreButton.innerHTML = originalText;
        loadMoreButton.disabled = false;
        
        showNotification('More projects loaded!', 'success');
    }, 1500);
}

// Create project card element
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.dataset.category = project.category;
    card.dataset.price = project.price;
    
    card.innerHTML = `
        <div class="project-image">
            <i class="fas fa-image"></i>
            <span class="price-tag">$${project.price}</span>
        </div>
        <div class="project-content">
            <h3 class="project-title">${project.title}</h3>
            <p class="project-creator">by ${project.creator}</p>
            <p class="project-description">${project.description}</p>
            <div class="project-tags">
                ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <div class="project-stats">
                <div class="rating">
                    <i class="fas fa-star"></i>
                    <span>${project.rating}</span>
                </div>
                <div class="views">
                    <i class="fas fa-eye"></i>
                    <span>${project.views}</span>
                </div>
            </div>
            <button class="btn btn-buy" onclick="buyProject('${project.title}', ${project.price})">
                <i class="fas fa-shopping-cart"></i>
                Buy Now
            </button>
        </div>
    `;
    
    return card;
}

// Setup buy buttons
function setupBuyButtons() {
    const buyButtons = document.querySelectorAll('.btn-buy');
    buyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.project-card');
            const title = card.querySelector('.project-title').textContent;
            const price = parseFloat(card.querySelector('.price-tag').textContent.replace('$', ''));
            buyProject(title, price);
        });
    });
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()">&times;</button>
        </div>
    `;
    
    // Add notification styles
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10001;
                animation: slideIn 0.3s ease;
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 15px 20px;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                min-width: 300px;
            }
            .notification-success {
                background: #10b981;
            }
            .notification-error {
                background: #ef4444;
            }
            .notification-info {
                background: #3b82f6;
            }
            .notification-content button {
                background: none;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
                margin-left: auto;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Initialize UI elements
function initializeUI() {
    // Add smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Add hover effects to project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Export functions for global access
window.buyProject = buyProject;
window.applyFilters = applyFilters;
window.loadMoreProjects = loadMoreProjects;
window.closeModal = closeModal;
window.processPurchase = processPurchase;
window.toggleTheme = toggleTheme; 