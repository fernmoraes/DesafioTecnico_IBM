import { useEffect } from 'react';
import { History as HistoryIcon } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useSummary } from '../context/SummaryContext';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatDate, truncateText } from '../utils/formatters';
import { SUMMARY_MODE_LABELS } from '../utils/constants';

const HistoryPage = () => {
  const { user } = useUser();
  const { summaries, loading, loadHistory } = useSummary();

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
          <Card key={summary.id} hover className="cursor-pointer">
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
