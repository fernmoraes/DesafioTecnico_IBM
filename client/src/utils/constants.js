// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// File Upload Configuration
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
  'text/plain': ['.txt']
};

// Summary Modes
export const SUMMARY_MODES = {
  TLDR: 'tldr',
  DETAILED: 'detailed',
  BULLETS: 'bullets',
  ELI5: 'eli5'
};

export const SUMMARY_MODE_LABELS = {
  [SUMMARY_MODES.TLDR]: 'TL;DR',
  [SUMMARY_MODES.DETAILED]: 'Detailed Summary',
  [SUMMARY_MODES.BULLETS]: 'Bullet Points',
  [SUMMARY_MODES.ELI5]: 'Explain Like I\'m 5'
};

export const SUMMARY_MODE_DESCRIPTIONS = {
  [SUMMARY_MODES.TLDR]: 'Quick 2-3 sentence overview',
  [SUMMARY_MODES.DETAILED]: 'Comprehensive paragraph-form summary',
  [SUMMARY_MODES.BULLETS]: 'Key takeaways in list format',
  [SUMMARY_MODES.ELI5]: 'Simplified explanation for everyone'
};

// Local Storage Keys
export const STORAGE_KEYS = {
  USER: 'ai_summarizer_user',
  THEME: 'ai_summarizer_theme'
};

// Error Messages
export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`,
  INVALID_FILE_TYPE: 'Only PDF and TXT files are supported',
  UPLOAD_FAILED: 'Failed to upload file. Please try again.',
  GENERATION_FAILED: 'Failed to generate summary. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  GENERIC_ERROR: 'Something went wrong. Please try again.'
};

// Made with Bob
