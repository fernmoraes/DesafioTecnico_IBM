import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { History as HistoryIcon, X, Copy, Check } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useSummary } from '../context/SummaryContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatDate, formatNumber, formatProcessingTime, calculateCompressionRatio, truncateText } from '../utils/formatters';
import { SUMMARY_MODE_LABELS } from '../utils/constants';

const SummaryModal = ({ summary, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary.summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const modal = (
    <div
      style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}
      onClick={onClose}
    >
      <div
        style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', width: '100%', maxWidth: '42rem', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
              {SUMMARY_MODE_LABELS[summary.mode]}
            </span>
            <span className="text-sm text-gray-500">{formatDate(summary.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy} icon={copied ? Check : Copy}>
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 flex-1" style={{ overflowY: 'auto' }}>
          {summary.mode === 'bullets' ? (
            <div className="space-y-2">
              {summary.summaryText.split('\n').filter(line => line.trim()).map((line, index) => (
                <div key={index} className="flex gap-2">
                  <span className="text-primary-600 font-bold">•</span>
                  <p className="text-gray-700 flex-1">{line.replace(/^-\s*/, '')}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{summary.summaryText}</p>
          )}
        </div>

        {/* Stats */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Original Words</p>
              <p className="text-lg font-bold text-gray-900">{formatNumber(summary.originalWordCount)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Summary Words</p>
              <p className="text-lg font-bold text-gray-900">{formatNumber(summary.summaryWordCount)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Compression</p>
              <p className="text-lg font-bold text-green-600">
                {calculateCompressionRatio(summary.originalWordCount, summary.summaryWordCount)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Processing Time</p>
              <p className="text-lg font-bold text-primary-600">{formatProcessingTime(summary.processingTime)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

const HistoryPage = () => {
  const { user } = useUser();
  const { summaries, loading, loadHistory } = useSummary();
  const [selectedSummary, setSelectedSummary] = useState(null);

  useEffect(() => {
    if (user) {
      loadHistory(user.id);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading your history..." />
      </div>
    );
  }

  if (!summaries || summaries.length === 0) {
    return (
      <Card className="text-center py-12">
        <HistoryIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          No Summaries Yet
        </h2>
        <p className="text-gray-600">
          Your generated summaries will appear here.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {selectedSummary && (
        <SummaryModal summary={selectedSummary} onClose={() => setSelectedSummary(null)} />
      )}

      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Summary History
        </h1>
        <p className="text-gray-600">
          View and manage your previously generated summaries
        </p>
      </div>

      <div className="space-y-4">
        {summaries.map((summary) => (
          <Card key={summary.id} hover className="cursor-pointer" onClick={() => setSelectedSummary(summary)}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                    {SUMMARY_MODE_LABELS[summary.mode]}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatDate(summary.createdAt)}
                  </span>
                </div>
                <p className="text-gray-700 mb-2">
                  {truncateText(summary.summaryText, 200)}
                </p>
                <div className="flex gap-4 text-sm text-gray-500">
                  <span>{summary.originalWordCount} → {summary.summaryWordCount} words</span>
                  <span>{summary.compressionRatio}% compression</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HistoryPage;

// Made with Bob
