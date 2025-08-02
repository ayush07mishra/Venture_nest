// Free Hugging Face Models for AI Interview Coach
// These models are free to use and work well for conversational AI

const FREE_MODELS = {
  // Option 1: GPT-2 - Text generation model
  gpt2: {
    url: 'https://api-inference.huggingface.co/models/gpt2',
    description: 'Text generation model, most reliable',
    maxLength: 200,
    temperature: 0.7
  },
  
  // Option 2: GPT-2 Medium - Better quality
  gpt2Medium: {
    url: 'https://api-inference.huggingface.co/models/gpt2-medium',
    description: 'Better quality text generation',
    maxLength: 250,
    temperature: 0.7
  }
};

// Default model to use
const DEFAULT_MODEL = 'gpt2';

module.exports = {
  FREE_MODELS,
  DEFAULT_MODEL
}; 