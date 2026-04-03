import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import FileUpload from '../components/upload/FileUpload';
import SummaryModeSelector from '../components/summary/SummaryModeSelector';
import SummaryDisplay from '../components/summary/SummaryDisplay';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { useUser } from '../context/UserContext';
import { useSummary } from '../context/SummaryContext';
import { uploadDocument } from '../services/documentService';
import { SUMMARY_MODES } from '../utils/constants';

const HomePage = () => {
  const { user } = useUser();
  const { currentSummary, loading, generateSummary } = useSummary();
  const [file, setFile] = useState(null);
  const [document, setDocument] = useState(null);
  const [selectedMode, setSelectedMode] = useState(SUMMARY_MODES.TLDR);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (selectedFile) => {
    setFile(selectedFile);
    setDocument(null);

    if (!selectedFile) return;

    if (!user) {
      toast.error('Please create a profile first');
      return;
    }

    try {
      setUploading(true);
      const uploadedDoc = await uploadDocument(selectedFile, user.id);
      setDocument(uploadedDoc);
      toast.success('Document uploaded successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to upload document');
      setFile(null);
    } finally {
      setUploading(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (!document || !selectedMode) {
      toast.error('Please upload a document and select a summary mode');
      return;
    }

    try {
      await generateSummary({
        userId: user.id,
        documentId: document.id,
        mode: selectedMode,
        textContent: document.textContent,
      });
      toast.success('Summary generated successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to generate summary');
    }
  };

  const handleReset = () => {
    setFile(null);
    setDocument(null);
  };

  return (
    <div className="space-y-8">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          AI Document Summarizer
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Upload your document and get intelligent summaries in multiple formats.
          Powered by IBM Granite AI.
        </p>
      </div>

      {/* Upload Section */}
      <Card>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          1. Upload Your Document
        </h2>
        <FileUpload
          onFileSelect={handleFileSelect}
          disabled={uploading || loading}
        />
        {uploading && (
          <div className="mt-4">
            <LoadingSpinner text="Uploading and processing document..." />
          </div>
        )}
      </Card>

      {/* Mode Selection */}
      {document && (
        <Card>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            2. Select Summary Type
          </h2>
          <SummaryModeSelector
            selectedMode={selectedMode}
            onModeChange={setSelectedMode}
            disabled={loading}
          />
          <div className="mt-6 flex gap-4">
            <Button
              onClick={handleGenerateSummary}
              disabled={loading || !selectedMode}
              loading={loading}
              icon={Sparkles}
              size="lg"
              className="flex-1"
            >
              Generate Summary
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              disabled={loading}
              size="lg"
            >
              Upload New Document
            </Button>
          </div>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <Card>
          <LoadingSpinner size="lg" text="Generating your summary..." />
          <p className="text-center text-sm text-gray-500 mt-4">
            This may take a few seconds
          </p>
        </Card>
      )}

      {/* Summary Display */}
      {currentSummary && !loading && (
        <Card>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            3. Your Summary
          </h2>
          <SummaryDisplay summary={currentSummary} />
        </Card>
      )}

      {/* Empty State */}
      {!file && !document && !currentSummary && (
        <Card className="text-center py-12">
          <div className="max-w-md mx-auto">
            <Sparkles className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Ready to Get Started?
            </h3>
            <p className="text-gray-600">
              Upload a PDF or text document to generate intelligent summaries
              in multiple formats.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default HomePage;

// Made with Bob
