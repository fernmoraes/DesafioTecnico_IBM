import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { SUMMARY_MODE_LABELS } from '../../utils/constants';
import { formatNumber, formatProcessingTime, calculateCompressionRatio } from '../../utils/formatters';

const SummaryDisplay = ({ summary }) => {
  const [copied, setCopied] = useState(false);

  if (!summary) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary.summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          {SUMMARY_MODE_LABELS[summary.mode]} Summary
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          icon={copied ? Check : Copy}
        >
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </div>

      <Card>
        <div className="prose max-w-none">
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
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {summary.summaryText}
            </p>
          )}
        </div>
      </Card>

      {/* Statistics */}
      <Card className="bg-gray-50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Original Words</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatNumber(summary.originalWordCount)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Summary Words</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatNumber(summary.summaryWordCount)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Compression</p>
            <p className="text-2xl font-bold text-green-600">
              {calculateCompressionRatio(summary.originalWordCount, summary.summaryWordCount)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Processing Time</p>
            <p className="text-2xl font-bold text-primary-600">
              {formatProcessingTime(summary.processingTime)}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SummaryDisplay;

// Made with Bob
