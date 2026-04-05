import { createContext, useContext, useState } from 'react';
import {
  generateSummary as generateSummaryAPI,
  getUserSummaries as getUserSummariesAPI,
  deleteSummary as deleteSummaryAPI,
} from '../services/summaryService';

const SummaryContext = createContext();

export const useSummary = () => {
  const context = useContext(SummaryContext);
  if (!context) {
    throw new Error('useSummary must be used within a SummaryProvider');
  }
  return context;
};

export const SummaryProvider = ({ children }) => {
  const [summaries, setSummaries] = useState([]);
  const [currentSummary, setCurrentSummary] = useState(null);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateSummary = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const summary = await generateSummaryAPI(data);
      setCurrentSummary(summary);
      setSummaries((prev) => [summary, ...prev]);
      return summary;
    } catch (err) {
      setError(err.message || 'Failed to generate summary');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async (userId, params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getUserSummariesAPI(userId, params);
      const fromServer = response.summaries || [];
      // Merge with in-session summaries (server may have restarted and lost them)
      setSummaries(prev => {
        const serverIds = new Set(fromServer.map(s => s.id));
        const inSessionOnly = prev.filter(s => !serverIds.has(s.id));
        return [...fromServer, ...inSessionOnly];
      });
      return response;
    } catch (err) {
      setError(err.message || 'Failed to load history');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteSummary = async (summaryId) => {
    try {
      setLoading(true);
      setError(null);
      await deleteSummaryAPI(summaryId);
      setSummaries((prev) => prev.filter((s) => s.id !== summaryId));
      if (currentSummary?.id === summaryId) {
        setCurrentSummary(null);
      }
    } catch (err) {
      setError(err.message || 'Failed to delete summary');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearCurrentSummary = () => {
    setCurrentSummary(null);
  };

  const clearAll = () => {
    setCurrentSummary(null);
    setCurrentDocument(null);
    setSummaries([]);
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    summaries,
    currentSummary,
    currentDocument,
    setCurrentDocument,
    loading,
    error,
    generateSummary,
    loadHistory,
    deleteSummary,
    clearCurrentSummary,
    clearAll,
    clearError,
  };

  return <SummaryContext.Provider value={value}>{children}</SummaryContext.Provider>;
};

// Made with Bob
