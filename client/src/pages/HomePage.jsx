import { useState } from 'react';
import { Sparkles, User } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import FileUpload from '../components/upload/FileUpload';
import SummaryModeSelector from '../components/summary/SummaryModeSelector';
import SummaryDisplay from '../components/summary/SummaryDisplay';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { useSummary } from '../context/SummaryContext';
import { useUser } from '../context/UserContext';
import { uploadDocument } from '../services/documentService';
import { SUMMARY_MODES } from '../utils/constants';

const HomePage = () => {
  const { user, createUser } = useUser();
  const { currentSummary, loading, generateSummary } = useSummary();
  const [file, setFile] = useState(null);
  const [document, setDocument] = useState(null);
  const [selectedMode, setSelectedMode] = useState(SUMMARY_MODES.TLDR);
  const [uploading, setUploading] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [profileData, setProfileData] = useState({ name: '', email: '' });
  const [creatingProfile, setCreatingProfile] = useState(false);

  const handleFileSelect = async (selectedFile) => {
    setFile(selectedFile);
    setDocument(null);

    if (!selectedFile) return;

    // Check if user exists
    if (!user) {
      toast.error('Please create a profile first');
      setFile(null);
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
    if (!user) {
      toast.error('Please create a profile first');
      return;
    }

    if (!document || !selectedMode) {
      toast.error('Please upload a document and select a summary mode');
      return;
    }

    try {
      await generateSummary({
        userId: user.id,
        documentId: document.id,
        mode: selectedMode,
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

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    
    if (!profileData.name || !profileData.email) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setCreatingProfile(true);
      await createUser(profileData.name, profileData.email);
      toast.success('Profile created successfully!');
      setShowProfileForm(false);
      setProfileData({ name: '', email: '' });
    } catch (error) {
      toast.error(error.message || 'Failed to create profile');
    } finally {
      setCreatingProfile(false);
    }
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

      {/* Profile Creation Section */}
      {!user && (
        <Card className="bg-primary-50 border-primary-200">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-primary-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Create Your Profile First
              </h3>
              <p className="text-gray-600 mb-4">
                To use the AI Document Summarizer, please create a quick profile. This helps us save your summaries and provide a personalized experience.
              </p>
              
              {!showProfileForm ? (
                <Button
                  onClick={() => setShowProfileForm(true)}
                  icon={User}
                  size="lg"
                >
                  Create Profile
                </Button>
              ) : (
                <form onSubmit={handleCreateProfile} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter your name"
                      required
                      disabled={creatingProfile}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter your email"
                      required
                      disabled={creatingProfile}
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      loading={creatingProfile}
                      disabled={creatingProfile}
                      size="lg"
                    >
                      Create Profile
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowProfileForm(false);
                        setProfileData({ name: '', email: '' });
                      }}
                      disabled={creatingProfile}
                      size="lg"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </Card>
      )}

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
