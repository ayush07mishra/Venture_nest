// Mock AI Interview Coach - Fallback when Hugging Face models are unavailable
// This provides realistic interview coaching responses

const interviewQuestions = {
  'Software Engineer': [
    "Can you tell me about a challenging project you worked on and how you handled it?",
    "Describe a time when you had to debug a complex issue. What was your approach?",
    "How do you stay updated with the latest technologies and programming languages?",
    "Tell me about a time when you had to work with a difficult team member.",
    "What's your experience with version control systems like Git?",
    "How do you approach code reviews and ensuring code quality?"
  ],
  'Product Manager': [
    "Can you walk me through a product you've managed from conception to launch?",
    "How do you prioritize features when resources are limited?",
    "Describe a time when you had to make a difficult product decision.",
    "How do you gather and analyze user feedback?",
    "Tell me about a time when a project was behind schedule. How did you handle it?",
    "What metrics do you use to measure product success?"
  ],
  'Data Analyst': [
    "Can you describe a data analysis project you worked on?",
    "What tools and technologies do you use for data analysis?",
    "Tell me about a time when you had to clean messy data.",
    "How do you ensure the accuracy of your analysis?",
    "Describe a situation where you had to present complex data to non-technical stakeholders.",
    "What's your experience with SQL and data visualization tools?"
  ],
  'Data Scientist': [
    "Can you walk me through a machine learning project you've worked on?",
    "How do you handle overfitting in your models?",
    "Describe your experience with different ML algorithms.",
    "How do you validate your model performance?",
    "Tell me about a time when you had to explain a complex model to stakeholders.",
    "What's your approach to feature engineering?"
  ],
  'UX Designer': [
    "Can you walk me through your design process for a recent project?",
    "How do you conduct user research and gather insights?",
    "Describe a time when you had to design for accessibility.",
    "How do you handle feedback from stakeholders or users?",
    "Tell me about a project where you had to balance user needs with business constraints.",
    "What tools do you use for prototyping and design?"
  ],
  'Marketing': [
    "Can you describe a successful marketing campaign you've worked on?",
    "How do you measure the ROI of your marketing efforts?",
    "Tell me about a time when you had to adapt a campaign strategy.",
    "How do you stay updated with marketing trends?",
    "Describe a situation where you had to work with a limited budget.",
    "What's your experience with digital marketing tools and platforms?"
  ],
  'Sales': [
    "Can you tell me about your biggest sale and how you achieved it?",
    "How do you handle objections from potential customers?",
    "Describe your sales process and methodology.",
    "How do you build and maintain relationships with clients?",
    "Tell me about a time when you had to meet a challenging sales target.",
    "What CRM systems have you worked with?"
  ],
  'General': [
    "Can you tell me about a challenging project you worked on and how you handled it?",
    "Describe a time when you had to work with a difficult team member.",
    "How do you handle stress and pressure in the workplace?",
    "Tell me about a time when you had to learn a new skill quickly.",
    "What are your career goals for the next few years?",
    "How do you stay motivated and productive?"
  ]
};

const feedbackTemplates = [
  "Great answer! Score: 8/10. You provided good details and showed strong problem-solving skills. ",
  "Excellent response! Score: 9/10. Your answer demonstrated leadership and technical expertise. ",
  "Good answer! Score: 7/10. You covered the key points well. Consider adding more specific examples. ",
  "Solid response! Score: 8/10. You showed good analytical thinking. ",
  "Well done! Score: 8/10. Your answer was comprehensive and well-structured. ",
  "Good job! Score: 7/10. You addressed the question effectively. "
];

const improvementTips = [
  "Try to include more specific metrics or quantifiable results.",
  "Consider adding more context about the challenges you faced.",
  "You could elaborate more on the lessons learned from this experience.",
  "Try to connect your answer more directly to the role requirements.",
  "Consider mentioning how this experience prepared you for future challenges.",
  "You could add more details about the team dynamics and collaboration."
];

function getMockInterviewResponse(resumeContent, userMessage, conversationHistory, role = 'General') {
  const questions = interviewQuestions[role] || interviewQuestions['General'];
  const questionIndex = conversationHistory.length / 2; // Each exchange is 2 messages (AI + User)
  
  if (!userMessage || userMessage.trim() === '') {
    // First message - start the interview
    const firstQuestion = questions[0];
    return `Hi! I'm your AI interview coach for a ${role} position. I've reviewed your resume and I'm excited to help you practice.

Let's begin! ${firstQuestion}

Remember to be specific and provide concrete examples from your experience.`;
  } else {
    // Follow-up messages - provide feedback and ask next question
    const feedback = feedbackTemplates[Math.floor(Math.random() * feedbackTemplates.length)];
    const tip = improvementTips[Math.floor(Math.random() * improvementTips.length)];
    
    if (questionIndex < questions.length - 1) {
      const nextQuestion = questions[questionIndex + 1];
      return `${feedback}${tip}

Next question: ${nextQuestion}`;
    } else {
      // Final summary
      const overallScore = Math.floor(Math.random() * 3) + 7; // Score between 7-9
      return `${feedback}${tip}

🎉 Interview Complete! 

Overall Score: ${overallScore}/10

Strengths:
✅ Strong technical knowledge
✅ Good communication skills
✅ Relevant experience

Areas to Improve:
📝 Add more specific examples
📝 Quantify your achievements
📝 Practice STAR method responses

Great job! Keep practicing and you'll do well in your interviews!`;
    }
  }
}

module.exports = {
  getMockInterviewResponse
}; 