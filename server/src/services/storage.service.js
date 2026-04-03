const { v4: uuidv4 } = require('uuid');
const { calculateCompressionRatio } = require('../utils/helpers');

/**
 * In-Memory Storage Service
 * Manages users, documents, and summaries in memory
 */
class StorageService {
  constructor() {
    this.users = new Map();
    this.documents = new Map();
    this.summaries = new Map();
    
    // Helper indexes for quick lookups
    this.userSummaries = new Map();
    this.documentSummaries = new Map();
  }

  // ==================== USER OPERATIONS ====================

  /**
   * Creates a new user
   */
  createUser(data) {
    const user = {
      id: uuidv4(),
      name: data.name,
      email: data.email,
      createdAt: new Date(),
      summaryCount: 0
    };
    
    this.users.set(user.id, user);
    this.userSummaries.set(user.id, []);
    
    return user;
  }

  /**
   * Gets a user by ID
   */
  getUser(userId) {
    return this.users.get(userId);
  }

  /**
   * Updates a user
   */
  updateUser(userId, updates) {
    const user = this.users.get(userId);
    if (!user) return null;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(userId, updatedUser);
    
    return updatedUser;
  }

  /**
   * Gets all users
   */
  getAllUsers() {
    return Array.from(this.users.values());
  }

  // ==================== DOCUMENT OPERATIONS ====================

  /**
   * Creates a new document
   */
  createDocument(data) {
    const document = {
      id: uuidv4(),
      userId: data.userId,
      filename: data.filename,
      fileType: data.fileType,
      fileSize: data.fileSize,
      textContent: data.textContent,
      uploadedAt: new Date(),
      wordCount: data.textContent.split(/\s+/).length
    };
    
    this.documents.set(document.id, document);
    this.documentSummaries.set(document.id, []);
    
    return document;
  }

  /**
   * Gets a document by ID
   */
  getDocument(documentId) {
    return this.documents.get(documentId);
  }

  /**
   * Gets all documents for a user
   */
  getUserDocuments(userId) {
    return Array.from(this.documents.values())
      .filter(doc => doc.userId === userId)
      .sort((a, b) => b.uploadedAt - a.uploadedAt);
  }

  /**
   * Deletes a document
   */
  deleteDocument(documentId) {
    const document = this.documents.get(documentId);
    if (!document) return false;
    
    // Delete associated summaries
    const summaryIds = this.documentSummaries.get(documentId) || [];
    summaryIds.forEach(summaryId => this.deleteSummary(summaryId));
    
    this.documents.delete(documentId);
    this.documentSummaries.delete(documentId);
    
    return true;
  }

  // ==================== SUMMARY OPERATIONS ====================

  /**
   * Creates a new summary
   */
  createSummary(data) {
    const summary = {
      id: uuidv4(),
      userId: data.userId,
      documentId: data.documentId,
      mode: data.mode,
      summaryText: data.summaryText,
      originalWordCount: data.originalWordCount,
      summaryWordCount: data.summaryWordCount,
      compressionRatio: calculateCompressionRatio(
        data.originalWordCount,
        data.summaryWordCount
      ),
      createdAt: new Date(),
      processingTime: data.processingTime
    };
    
    this.summaries.set(summary.id, summary);
    
    // Update indexes
    const userSums = this.userSummaries.get(data.userId) || [];
    userSums.unshift(summary.id);
    this.userSummaries.set(data.userId, userSums);
    
    const docSums = this.documentSummaries.get(data.documentId) || [];
    docSums.push(summary.id);
    this.documentSummaries.set(data.documentId, docSums);
    
    // Update user summary count
    const user = this.users.get(data.userId);
    if (user) {
      user.summaryCount++;
    }
    
    return summary;
  }

  /**
   * Gets a summary by ID
   */
  getSummary(summaryId) {
    return this.summaries.get(summaryId);
  }

  /**
   * Gets all summaries for a user
   */
  getUserSummaries(userId, limit = 20, offset = 0) {
    const summaryIds = this.userSummaries.get(userId) || [];
    const paginatedIds = summaryIds.slice(offset, offset + limit);
    
    return paginatedIds
      .map(id => {
        const summary = this.summaries.get(id);
        if (!summary) return null;
        
        // Include document filename
        const document = this.documents.get(summary.documentId);
        return {
          ...summary,
          filename: document?.filename
        };
      })
      .filter(Boolean);
  }

  /**
   * Gets summary count for a user
   */
  getUserSummaryCount(userId) {
    return (this.userSummaries.get(userId) || []).length;
  }

  /**
   * Gets all summaries for a document
   */
  getDocumentSummaries(documentId) {
    const summaryIds = this.documentSummaries.get(documentId) || [];
    return summaryIds.map(id => this.summaries.get(id)).filter(Boolean);
  }

  /**
   * Deletes a summary
   */
  deleteSummary(summaryId) {
    const summary = this.summaries.get(summaryId);
    if (!summary) return false;
    
    // Remove from indexes
    const userSums = this.userSummaries.get(summary.userId) || [];
    this.userSummaries.set(
      summary.userId,
      userSums.filter(id => id !== summaryId)
    );
    
    const docSums = this.documentSummaries.get(summary.documentId) || [];
    this.documentSummaries.set(
      summary.documentId,
      docSums.filter(id => id !== summaryId)
    );
    
    // Update user summary count
    const user = this.users.get(summary.userId);
    if (user && user.summaryCount > 0) {
      user.summaryCount--;
    }
    
    this.summaries.delete(summaryId);
    return true;
  }

  // ==================== UTILITY OPERATIONS ====================

  /**
   * Gets storage statistics
   */
  getStats() {
    return {
      users: this.users.size,
      documents: this.documents.size,
      summaries: this.summaries.size
    };
  }

  /**
   * Clears all data (for testing)
   */
  clearAll() {
    this.users.clear();
    this.documents.clear();
    this.summaries.clear();
    this.userSummaries.clear();
    this.documentSummaries.clear();
  }
}

// Export singleton instance
module.exports = new StorageService();

// Made with Bob
