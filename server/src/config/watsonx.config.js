require('dotenv').config();

/**
 * IBM watsonx.ai Configuration
 */

const watsonxConfig = {
  apiKey: process.env.WATSONX_API_KEY,
  projectId: process.env.WATSONX_PROJECT_ID,
  serviceUrl: process.env.WATSONX_URL || process.env.WATSONX_SERVICE_URL || 'https://us-south.ml.cloud.ibm.com',
  modelId: process.env.WATSONX_MODEL_ID || 'ibm/granite-3-8b-instruct',
  
  // Default model parameters
  defaultParameters: {
    max_new_tokens: 500,
    temperature: 0.7,
    top_p: 0.9,
    top_k: 50,
    repetition_penalty: 1.1
  },
  
  // API timeout in milliseconds
  timeout: 30000
};

// Validate required configuration
const validateConfig = () => {
  const required = ['apiKey', 'projectId'];
  const missing = required.filter(key => !watsonxConfig[key]);
  
  if (missing.length > 0) {
    console.warn(`⚠️  Missing watsonx.ai configuration: ${missing.join(', ')}`);
    console.warn('⚠️  Please set the following environment variables:');
    missing.forEach(key => {
      console.warn(`   - WATSONX_${key.toUpperCase()}`);
    });
  }
  
  return missing.length === 0;
};

module.exports = {
  ...watsonxConfig,
  isConfigured: validateConfig()
};

// Made with Bob
