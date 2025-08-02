// Global variables
let resumeContent = '';
let conversationHistory = [];
let selectedRole = 'General';
let isInterviewStarted = false;

// DOM elements
const uploadSection = document.getElementById('upload-section');
const chatSection = document.getElementById('chat-section');
const resumeUpload = document.getElementById('resume-upload');
const uploadBtn = document.getElementById('upload-btn');
const fileName = document.getElementById('file-name');
const resumeContentTextarea = document.getElementById('resume-content');
const startInterviewBtn = document.getElementById('start-interview-btn');
const roleSelect = document.getElementById('role-select');
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const resetBtn = document.getElementById('reset-btn');
const loadingOverlay = document.getElementById('loading-overlay');
const typingIndicator = document.getElementById('typing-indicator');

// Event listeners
uploadBtn.addEventListener('click', () => resumeUpload.click());
resumeUpload.addEventListener('change', handleFileUpload);
startInterviewBtn.addEventListener('click', startInterview);
roleSelect.addEventListener('change', handleRoleChange);
sendBtn.addEventListener('click', sendMessage);
resetBtn.addEventListener('click', resetApp);
userInput.addEventListener('keypress', handleKeyPress);

// Handle file upload
async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file.');
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB.');
        return;
    }

    showLoading('Processing your resume...');
    
    try {
        const formData = new FormData();
        formData.append('resume', file);

        const response = await fetch('/upload-resume', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            resumeContent = data.resumeContent;
            fileName.textContent = `✓ ${file.name}`;
            fileName.style.color = '#27ae60';
            resumeContentTextarea.value = resumeContent.substring(0, 500) + (resumeContent.length > 500 ? '...' : '');
            startInterviewBtn.disabled = false;
        } else {
            throw new Error(data.error || 'Failed to process resume');
        }
    } catch (error) {
        console.error('Error uploading resume:', error);
        alert('Error processing resume. Please try again.');
        fileName.textContent = '';
    } finally {
        hideLoading();
    }
}

// Handle role selection
function handleRoleChange(event) {
    selectedRole = event.target.value;
}

// Start the interview
async function startInterview() {
    if (!resumeContent) {
        alert('Please upload a resume first.');
        return;
    }

    showLoading('Starting your mock interview...');
    
    try {
        const response = await fetch('/interview', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                resumeContent: resumeContent,
                userMessage: '',
                conversationHistory: [],
                role: selectedRole
            })
        });

        const data = await response.json();

        if (data.success) {
            isInterviewStarted = true;
            conversationHistory = [];
            
            // Add AI's first message
            addMessage(data.response, 'ai');
            conversationHistory.push({ role: 'ai', content: data.response });
            
            // Switch to chat interface
            uploadSection.style.display = 'none';
            chatSection.style.display = 'flex';
            
            // Enable user input
            userInput.disabled = false;
            sendBtn.disabled = false;
            userInput.focus();
        } else {
            throw new Error(data.error || 'Failed to start interview');
        }
    } catch (error) {
        console.error('Error starting interview:', error);
        alert('Error starting interview. Please try again.');
    } finally {
        hideLoading();
    }
}

// Send user message
async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // Add user message to chat
    addMessage(message, 'user');
    conversationHistory.push({ role: 'user', content: message });
    
    // Clear input
    userInput.value = '';
    sendBtn.disabled = true;
    userInput.disabled = true;

    // Show typing indicator
    typingIndicator.style.display = 'flex';

    try {
        const response = await fetch('/interview', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                resumeContent: resumeContent,
                userMessage: message,
                conversationHistory: conversationHistory,
                role: selectedRole
            })
        });

        const data = await response.json();

        if (data.success) {
            // Add AI response
            addMessage(data.response, 'ai');
            conversationHistory.push({ role: 'ai', content: data.response });
        } else {
            throw new Error(data.error || 'Failed to get AI response');
        }
    } catch (error) {
        console.error('Error sending message:', error);
        addMessage('Sorry, I encountered an error. Please try again.', 'ai');
    } finally {
        // Hide typing indicator and re-enable input
        typingIndicator.style.display = 'none';
        userInput.disabled = false;
        sendBtn.disabled = false;
        userInput.focus();
    }
}

// Add message to chat
function addMessage(content, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = content;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Handle Enter key press
function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        if (!sendBtn.disabled) {
            sendMessage();
        }
    }
}

// Reset the application
function resetApp() {
    // Reset all variables
    resumeContent = '';
    conversationHistory = [];
    isInterviewStarted = false;
    
    // Reset UI
    uploadSection.style.display = 'block';
    chatSection.style.display = 'none';
    chatMessages.innerHTML = '';
    userInput.value = '';
    resumeContentTextarea.value = '';
    fileName.textContent = '';
    startInterviewBtn.disabled = true;
    userInput.disabled = true;
    sendBtn.disabled = true;
    typingIndicator.style.display = 'none';
    
    // Reset file input
    resumeUpload.value = '';
}

// Show loading overlay
function showLoading(message = 'Loading...') {
    loadingOverlay.querySelector('p').textContent = message;
    loadingOverlay.style.display = 'flex';
}

// Hide loading overlay
function hideLoading() {
    loadingOverlay.style.display = 'none';
}

// Auto-resize textarea
userInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
});

// Enable send button when user types
userInput.addEventListener('input', function() {
    sendBtn.disabled = !this.value.trim() || this.disabled;
});

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Set initial state
    startInterviewBtn.disabled = true;
    userInput.disabled = true;
    sendBtn.disabled = true;
    
    // Focus on role selector
    roleSelect.focus();
}); 