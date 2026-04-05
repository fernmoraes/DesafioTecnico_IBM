/**
 * Formats a date to a readable string
 * @param {Date|string} date - The date to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (date) => {
  const d = new Date(date);
  const now = new Date();
  const diffTime = Math.abs(now - d);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // If today
  if (diffDays === 0) {
    return `Today at ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  }

  // If yesterday
  if (diffDays === 1) {
    return `Yesterday at ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  }

  // If within a week
  if (diffDays < 7) {
    return d.toLocaleDateString('en-US', { weekday: 'long', hour: '2-digit', minute: '2-digit' });
  }

  // Otherwise
  return d.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Formats a number with commas
 * @param {number} num - The number to format
 * @returns {string} - Formatted number string
 */
export const formatNumber = (num) => {
  if (num === undefined || num === null) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Formats processing time to readable string
 * @param {number} milliseconds - Time in milliseconds
 * @returns {string} - Formatted time string
 */
export const formatProcessingTime = (milliseconds) => {
  if (!milliseconds && milliseconds !== 0) return 'N/A';
  if (milliseconds < 1000) {
    return `${milliseconds}ms`;
  }
  
  const seconds = (milliseconds / 1000).toFixed(1);
  return `${seconds}s`;
};

/**
 * Truncates text to a specified length
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Calculates compression ratio
 * @param {number} originalCount - Original word count
 * @param {number} summaryCount - Summary word count
 * @returns {string} - Formatted compression ratio
 */
export const calculateCompressionRatio = (originalCount, summaryCount) => {
  if (originalCount === 0) return '0%';
  const ratio = ((1 - summaryCount / originalCount) * 100).toFixed(1);
  return `${ratio}%`;
};

/**
 * Counts words in a text
 * @param {string} text - The text to count words in
 * @returns {number} - Word count
 */
export const countWords = (text) => {
  if (!text) return 0;
  return text.trim().split(/\s+/).length;
};

// Made with Bob
