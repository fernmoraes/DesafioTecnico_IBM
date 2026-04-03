const { SUMMARY_MODES } = require('./constants');

/**
 * AI Prompt templates for different summary modes
 */

const PROMPTS = {
  [SUMMARY_MODES.TLDR]: (text) => `You are a professional summarization assistant. Your task is to create an extremely concise TL;DR (Too Long; Didn't Read) summary.

Instructions:
- Provide exactly 2-3 sentences
- Capture only the most critical main point
- Use clear, direct language
- No bullet points or formatting

Document to summarize:
${text}

TL;DR:`,

  [SUMMARY_MODES.DETAILED]: (text) => `You are a professional summarization assistant. Create a detailed, comprehensive summary of the following document.

Instructions:
- Write 2-4 well-structured paragraphs
- Include main arguments, key findings, and important details
- Maintain logical flow and coherence
- Use professional, clear language
- Preserve important context and nuance

Document to summarize:
${text}

Detailed Summary:`,

  [SUMMARY_MODES.BULLETS]: (text) => `You are a professional summarization assistant. Extract the key points from the following document and present them as a bullet-point list.

Instructions:
- Provide 5-8 bullet points
- Each point should be one clear, complete sentence
- Focus on main ideas, findings, and conclusions
- Order points by importance
- Start each bullet with a dash (-)

Document to summarize:
${text}

Key Points:`,

  [SUMMARY_MODES.ELI5]: (text) => `You are a friendly teacher explaining complex topics to a 10-year-old. Simplify the following document using everyday language and relatable examples.

Instructions:
- Use simple words and short sentences
- Avoid jargon and technical terms
- Include analogies or examples when helpful
- Make it engaging and easy to understand
- Write 2-3 paragraphs

Document to simplify:
${text}

Simple Explanation:`
};

/**
 * Builds a prompt for the specified summary mode
 * @param {string} text - The text to summarize
 * @param {string} mode - The summary mode
 * @returns {string} - The constructed prompt
 */
const buildPrompt = (text, mode) => {
  const promptBuilder = PROMPTS[mode];
  
  if (!promptBuilder) {
    throw new Error(`Invalid summary mode: ${mode}`);
  }
  
  // Truncate text if too long (max ~8000 words to stay within token limits)
  const maxWords = 8000;
  const words = text.trim().split(/\s+/);
  const truncatedText = words.length > maxWords 
    ? words.slice(0, maxWords).join(' ') + '...'
    : text;
  
  return promptBuilder(truncatedText);
};

/**
 * Gets model parameters for the specified mode
 * @param {string} mode - The summary mode
 * @returns {Object} - Model parameters
 */
const getModelParameters = (mode) => {
  const baseParams = {
    max_new_tokens: 500,
    temperature: 0.7,
    top_p: 0.9,
    top_k: 50,
    repetition_penalty: 1.1
  };

  const modeParams = {
    [SUMMARY_MODES.TLDR]: {
      max_new_tokens: 100,
      temperature: 0.5,
      stop_sequences: ['\n\n']
    },
    [SUMMARY_MODES.DETAILED]: {
      max_new_tokens: 500,
      temperature: 0.7,
      stop_sequences: ['\n\n\n']
    },
    [SUMMARY_MODES.BULLETS]: {
      max_new_tokens: 400,
      temperature: 0.6,
      stop_sequences: ['\n\n']
    },
    [SUMMARY_MODES.ELI5]: {
      max_new_tokens: 400,
      temperature: 0.8
    }
  };

  return {
    ...baseParams,
    ...modeParams[mode]
  };
};

module.exports = {
  buildPrompt,
  getModelParameters
};

// Made with Bob
