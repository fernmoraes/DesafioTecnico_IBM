const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
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
    const passwordHash = bcrypt.hashSync(data.password, 10);
    const user = {
      id: uuidv4(),
      name: data.name,
      email: data.email,
      passwordHash,
      createdAt: new Date(),
      summaryCount: 0
    };

    this.users.set(user.id, user);
    this.userSummaries.set(user.id, []);

    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }

  verifyPassword(user, password) {
    return bcrypt.compareSync(password, user.passwordHash);
  }

  /**
   * Gets a user by ID
   */
  getUser(userId) {
    const user = this.users.get(userId);
    if (!user) return null;
    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }

  getUserRaw(userId) {
    return this.users.get(userId);
  }

  /**
   * Gets a user by email
   */
  getUserByEmail(email) {
    return Array.from(this.users.values()).find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    ) || null;
    // Returns raw user (with passwordHash) for internal auth use
  }

  /**
   * Updates a user
   */
  updateUser(userId, updates) {
    const user = this.users.get(userId);
    if (!user) return null;

    const { password, passwordHash: _ph, ...safeUpdates } = updates;
    const updatedUser = { ...user, ...safeUpdates };
    if (password) updatedUser.passwordHash = bcrypt.hashSync(password, 10);
    this.users.set(userId, updatedUser);

    const { passwordHash: _, ...safeUser } = updatedUser;
    return safeUser;
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
    if (data.userId) {
      const userSums = this.userSummaries.get(data.userId) || [];
      userSums.unshift(summary.id);
      this.userSummaries.set(data.userId, userSums);

      const user = this.users.get(data.userId);
      if (user) user.summaryCount++;
    }

    const docSums = this.documentSummaries.get(data.documentId) || [];
    docSums.push(summary.id);
    this.documentSummaries.set(data.documentId, docSums);
    
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
    if (summary.userId) {
      const userSums = this.userSummaries.get(summary.userId) || [];
      this.userSummaries.set(summary.userId, userSums.filter(id => id !== summaryId));

      const user = this.users.get(summary.userId);
      if (user && user.summaryCount > 0) user.summaryCount--;
    }

    const docSums = this.documentSummaries.get(summary.documentId) || [];
    this.documentSummaries.set(
      summary.documentId,
      docSums.filter(id => id !== summaryId)
    );
    
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
