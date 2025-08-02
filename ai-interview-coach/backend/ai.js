const axios = require('axios');
const pdfParse = require('pdf-parse');
const fs = require('fs');
require('dotenv').config();
const { FREE_MODELS, DEFAULT_MODEL } = require('./models');
const { getMockInterviewResponse } = require('./mock-ai');

// Use the default model or allow environment variable override
const MODEL_NAME = process.env.AI_MODEL || DEFAULT_MODEL;
const MODEL_CONFIG = FREE_MODELS[MODEL_NAME] || FREE_MODELS[DEFAULT_MODEL];
const HUGGINGFACE_API_URL = MODEL_CONFIG.url;
const API_KEY = process.env.HUGGINGFACE_API_KEY;

if (!API_KEY) {
  console.error('HUGGINGFACE_API_KEY environment variable is required');
  process.exit(1);
}

console.log(`🤖 Using AI Model: ${MODEL_NAME} (${MODEL_CONFIG.description})`);

// Parse PDF resume
async function parseResume(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF file');
  }
}

// Generate interview response using Hugging Face API
async function generateInterviewResponse(resumeContent, userMessage, conversationHistory = [], role = 'General') {
  try {
    // Create a simple, effective prompt for the models
    let prompt;
    
    if (!userMessage || userMessage.trim() === '') {
      // First message - start the interview
      prompt = `Interview Coach: Hi! I'm your AI interview coach for a ${role} position. Based on your resume: ${resumeContent.substring(0, 300)}... 

Let's begin! Can you tell me about a challenging project you worked on and how you handled it?`;
    } else {
      // Follow-up messages - provide feedback and ask next question
      prompt = `Interview Coach: The user answered: "${userMessage}"

Great answer! Score: 8/10. You provided good details about the project. Next question: Can you describe a time when you had to work with a difficult team member?`;
    }

          const response = await axios.post(
        HUGGINGFACE_API_URL,
        {
          inputs: prompt,
          parameters: {
            max_new_tokens: 100,
            temperature: MODEL_CONFIG.temperature,
            top_p: 0.9,
            do_sample: true,
            return_full_text: false
          }
        },
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );

    // Handle different response formats
    if (response.data && typeof response.data === 'string') {
      return response.data;
    } else if (Array.isArray(response.data) && response.data[0]?.generated_text) {
      return response.data[0].generated_text;
    } else if (response.data?.generated_text) {
      return response.data.generated_text;
    } else {
      throw new Error('Unexpected Hugging Face response format');
    }

      } catch (error) {
      console.error('Error calling Hugging Face API:', error);
      if (error.response) {
        console.error('API Error Status:', error.response.status);
        console.error('API Error Data:', error.response.data);
        console.error('API URL:', HUGGINGFACE_API_URL);
      }
      
      // Try fallback model if current one fails
      if (MODEL_NAME !== 'gpt2') {
        console.log('🔄 Trying fallback to GPT-2...');
        const fallbackConfig = FREE_MODELS['gpt2'];
        const fallbackResponse = await axios.post(
          fallbackConfig.url,
          {
            inputs: prompt,
            parameters: {
              max_new_tokens: 100,
              temperature: fallbackConfig.temperature,
              top_p: 0.9,
              do_sample: true,
              return_full_text: false
            }
          },
          {
            headers: {
              Authorization: `Bearer ${API_KEY}`,
              'Content-Type': 'application/json'
            },
            timeout: 30000
          }
        );
        
        if (fallbackResponse.data && typeof fallbackResponse.data === 'string') {
          return fallbackResponse.data;
        } else if (Array.isArray(fallbackResponse.data) && fallbackResponse.data[0]?.generated_text) {
          return fallbackResponse.data[0].generated_text;
        } else if (fallbackResponse.data?.generated_text) {
          return fallbackResponse.data.generated_text;
        }
      }
      
      // If all AI models fail, use mock AI as fallback
      console.log('🔄 Using mock AI as fallback...');
      return getMockInterviewResponse(resumeContent, userMessage, conversationHistory, role);
    }
}

module.exports = {
  parseResume,
  generateInterviewResponse
};
