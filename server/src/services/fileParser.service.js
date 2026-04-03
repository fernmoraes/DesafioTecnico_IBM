const pdfParse = require('pdf-parse');
const { cleanText } = require('../utils/helpers');

/**
 * File Parser Service
 * Extracts text from PDF and TXT files
 */
class FileParserService {
  /**
   * Extracts text from a file buffer
   * @param {Buffer} buffer - File buffer
   * @param {string} fileType - File MIME type
   * @returns {Promise<string>} - Extracted text
   */
  async extractText(buffer, fileType) {
    try {
      if (fileType === 'application/pdf') {
        return await this.parsePDF(buffer);
      } else if (fileType === 'text/plain') {
        return this.parseTXT(buffer);
      } else {
        throw new Error(`Unsupported file type: ${fileType}`);
      }
    } catch (error) {
      console.error('Error extracting text:', error);
      throw new Error(`Failed to extract text from file: ${error.message}`);
    }
  }

  /**
   * Parses PDF file
   * @param {Buffer} buffer - PDF file buffer
   * @returns {Promise<string>} - Extracted text
   */
  async parsePDF(buffer) {
    try {
      const data = await pdfParse(buffer);
      const text = data.text;
      
      if (!text || text.trim().length === 0) {
        throw new Error('PDF appears to be empty or contains no extractable text');
      }
      
      return cleanText(text);
    } catch (error) {
      console.error('PDF parsing error:', error);
      throw new Error('Failed to parse PDF file. The file may be corrupted or password-protected.');
    }
  }

  /**
   * Parses TXT file
   * @param {Buffer} buffer - TXT file buffer
   * @returns {string} - Extracted text
   */
  parseTXT(buffer) {
    try {
      const text = buffer.toString('utf-8');
      
      if (!text || text.trim().length === 0) {
        throw new Error('Text file appears to be empty');
      }
      
      return cleanText(text);
    } catch (error) {
      console.error('TXT parsing error:', error);
      throw new Error('Failed to parse text file. The file may be corrupted or use an unsupported encoding.');
    }
  }

  /**
   * Validates extracted text
   * @param {string} text - Extracted text
   * @returns {boolean} - True if valid
   */
  validateText(text) {
    if (!text || typeof text !== 'string') {
      return false;
    }
    
    const trimmedText = text.trim();
    
    // Check minimum length (at least 10 words)
    const wordCount = trimmedText.split(/\s+/).length;
    if (wordCount < 10) {
      return false;
    }
    
    return true;
  }

  /**
   * Gets text statistics
   * @param {string} text - Text to analyze
   * @returns {Object} - Text statistics
   */
  getTextStats(text) {
    const words = text.trim().split(/\s+/);
    const characters = text.length;
    const lines = text.split('\n').length;
    
    return {
      wordCount: words.length,
      characterCount: characters,
      lineCount: lines
    };
  }
}

// Export singleton instance
module.exports = new FileParserService();

// Made with Bob
