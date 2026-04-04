const axios = require('axios');
const watsonxConfig = require('../config/watsonx.config');
const { buildPrompt, getModelParameters } = require('../utils/prompts');
const { countWords } = require('../utils/helpers');

/**
 * IBM watsonx.ai Service
 * Handles AI text generation using IBM Granite model
 */
class WatsonXService {
  constructor() {
    this.config = watsonxConfig;
    this.client = null;
    this.iamToken = null;
    this.iamTokenExpiry = null;

    if (this.config.isConfigured) {
      this.initializeClient();
    }
  }

  /**
   * Initializes the Axios client for watsonx.ai API
   */
  initializeClient() {
    this.client = axios.create({
      baseURL: this.config.serviceUrl,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }

  /**
   * Fetches an IAM Bearer token from the IBM Cloud IAM service
   */
  async getIAMToken() {
    const now = Date.now();
    if (this.iamToken && this.iamTokenExpiry && now < this.iamTokenExpiry) {
      return this.iamToken;
    }

    const response = await axios.post(
      'https://iam.cloud.ibm.com/identity/token',
      new URLSearchParams({
        grant_type: 'urn:ibm:params:oauth:grant-type:apikey',
        apikey: this.config.apiKey
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    this.iamToken = response.data.access_token;
    // Expire 5 minutes before actual expiry to avoid edge cases
    this.iamTokenExpiry = now + (response.data.expires_in - 300) * 1000;
    return this.iamToken;
  }

  /**
   * Checks if the service is configured
   */
  isConfigured() {
    return this.config.isConfigured && this.client !== null;
  }

  /**
   * Generates a summary using IBM Granite model
   * @param {string} textContent - Text to summarize
   * @param {string} mode - Summary mode (tldr, detailed, bullets, eli5)
   * @returns {Promise<string>} - Generated summary
   */
  async generateSummary(textContent, mode) {
    if (!this.isConfigured()) {
      throw this.createAIError('watsonx.ai is not configured. Please set WATSONX_API_KEY and WATSONX_PROJECT_ID environment variables.');
    }

    try {
      // Build prompt for the specified mode
      const prompt = buildPrompt(textContent, mode);
      const parameters = getModelParameters(mode);

      console.log(`Generating ${mode} summary...`);
      
      // Call watsonx.ai API
      const response = await this.callAPI(prompt, parameters);
      
      // Extract and post-process the generated text
      const generatedText = this.extractGeneratedText(response);
      const processedSummary = this.postProcess(generatedText, mode);

      console.log(`Summary generated successfully (${countWords(processedSummary)} words)`);
      
      return processedSummary;
    } catch (error) {
      console.error('Error generating summary:', error.message);
      throw this.createAIError(error.message);
    }
  }

  /**
   * Calls the watsonx.ai API
   * @param {string} prompt - The prompt to send
   * @param {Object} parameters - Model parameters
   * @returns {Promise<Object>} - API response
   */
  async callAPI(prompt, parameters) {
    try {
      const token = await this.getIAMToken();

      const requestBody = {
        model_id: this.config.modelId,
        input: prompt,
        parameters: {
          ...this.config.defaultParameters,
          ...parameters
        },
        project_id: this.config.projectId
      };

      const response = await this.client.post(
        '/ml/v1/text/generation?version=2023-05-29',
        requestBody,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      return response.data;
    } catch (error) {
      if (error.response) {
        // API returned an error response
        const status = error.response.status;
        const message = error.response.data?.error?.message || error.response.statusText;
        
        if (status === 401) {
          throw new Error('Invalid API key. Please check your WATSONX_API_KEY.');
        } else if (status === 403) {
          throw new Error('Access forbidden. Please check your project permissions.');
        } else if (status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        } else {
          throw new Error(`API error (${status}): ${message}`);
        }
      } else if (error.request) {
        // Request was made but no response received
        throw new Error('No response from watsonx.ai API. Please check your network connection.');
      } else {
        // Error in request setup
        throw new Error(`Request error: ${error.message}`);
      }
    }
  }

  /**
   * Extracts generated text from API response
   * @param {Object} response - API response
   * @returns {string} - Generated text
   */
  extractGeneratedText(response) {
    if (!response || !response.results || !response.results[0]) {
      throw new Error('Invalid response format from watsonx.ai API');
    }

    const generatedText = response.results[0].generated_text;
    
    if (!generatedText || generatedText.trim().length === 0) {
      throw new Error('Empty response from watsonx.ai API');
    }

    return generatedText;
  }

  /**
   * Post-processes the generated summary
   * @param {string} text - Generated text
   * @param {string} mode - Summary mode
   * @returns {string} - Processed summary
   */
  postProcess(text, mode) {
    let processed = text.trim();

    // Remove any prompt artifacts that might have leaked through
    processed = processed.replace(/^(TL;DR:|Detailed Summary:|Key Points:|Simple Explanation:)\s*/i, '');

    // For tldr and detailed modes, ensure we end on a complete sentence
    if (mode === 'tldr' || mode === 'detailed') {
      const lastPeriod = processed.lastIndexOf('.');
      const lastQuestion = processed.lastIndexOf('?');
      const lastExclamation = processed.lastIndexOf('!');
      
      const lastPunctuation = Math.max(lastPeriod, lastQuestion, lastExclamation);
      
      if (lastPunctuation > 0 && lastPunctuation < processed.length - 1) {
        processed = processed.substring(0, lastPunctuation + 1);
      }
    }

    // For bullets mode, ensure proper formatting
    if (mode === 'bullets') {
      // Split into lines and clean up
      const lines = processed.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
      
      // Ensure each line starts with a dash
      const formattedLines = lines.map(line => {
        if (!line.startsWith('-') && !line.startsWith('•')) {
          return `- ${line}`;
        }
        return line.replace(/^•/, '-');
      });
      
      processed = formattedLines.join('\n');
    }

    return processed;
  }

  /**
   * Creates an AI service error
   * @param {string} message - Error message
   * @returns {Error} - AI service error
   */
  createAIError(message) {
    const error = new Error(message);
    error.name = 'AIServiceError';
    return error;
  }

  /**
   * Tests the connection to watsonx.ai
   * @returns {Promise<boolean>} - True if connection successful
   */
  async testConnection() {
    if (!this.isConfigured()) {
      return false;
    }

    try {
      const testPrompt = 'Say "Hello" in one word.';
      const response = await this.callAPI(testPrompt, { max_new_tokens: 10 });
      return !!response;
    } catch (error) {
      console.error('Connection test failed:', error.message);
      return false;
    }
  }
}

// Export singleton instance
module.exports = new WatsonXService();

// Made with Bob
