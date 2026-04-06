import { useState } from 'react';
import ibmBg from '../assets/ibmbgimg.png';
import { useTranslation } from 'react-i18next';
import { ArrowRight, DocumentMultiple_01, List, LightFilled, Education } from '@carbon/icons-react';
import toast, { Toaster } from 'react-hot-toast';
import { Button, TextInput, Loading } from '@carbon/react';
import FileUpload from '../components/upload/FileUpload';
import SummaryModeSelector from '../components/summary/SummaryModeSelector';
import SummaryDisplay from '../components/summary/SummaryDisplay';
import { useSummary } from '../context/SummaryContext';
import { useUser } from '../context/UserContext';
import { uploadDocument } from '../services/documentService';
import { SUMMARY_MODES } from '../utils/constants';

const PAGE_MAX = '1312px';
const PAGE_PX  = 'clamp(1rem, 5vw, 5rem)';
const SEC_PY   = '5rem';

const StepBadge = ({ n, done }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: '2rem', height: '2rem',
    backgroundColor: done ? '#24a148' : 'var(--ibm-blue)',
    color: 'var(--ibm-white)', fontSize: '0.875rem', fontWeight: 600, flexShrink: 0,
  }}>{n}</span>
);

const HomePage = () => {
  const { t } = useTranslation();
  const { user, createUser, refreshUser } = useUser();
  const { currentSummary, currentDocument: uploadedDoc, setCurrentDocument: setDocument, loading, generateSummary } = useSummary();
  const [file, setFile] = useState(null);
  const [selectedMode, setSelectedMode] = useState(SUMMARY_MODES.TLDR);
  const [uploading, setUploading] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [profileData, setProfileData] = useState({ name: '', email: '' });
  const [creatingProfile, setCreatingProfile] = useState(false);

  const handleFileSelect = async (selectedFile) => {
    setFile(selectedFile);
    setDocument(null);
    if (!selectedFile) return;
    if (!user) { toast.error(t('errors.profileRequired')); setFile(null); return; }
    try {
      setUploading(true);
      const doc = await uploadDocument(selectedFile, user.id);
      setDocument(doc);
      toast.success(t('success.documentUploaded'));
    } catch (err) {
      toast.error(err.message || t('errors.uploadFailed'));
      setFile(null);
    } finally { setUploading(false); }
  };

  const handleGenerateSummary = async () => {
    if (!user) { toast.error(t('errors.profileRequired')); return; }
    if (!uploadedDoc || !selectedMode) { toast.error(t('errors.selectDocAndMode')); return; }
    try {
      await generateSummary({ userId: user.id, documentId: uploadedDoc.id, mode: selectedMode });
      await refreshUser();
      toast.success(t('success.summaryGenerated'));
    } catch (err) { toast.error(err.message || t('errors.summaryFailed')); }
  };

  const handleReset = () => { setFile(null); setDocument(null); };

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    if (!profileData.name || !profileData.email) { toast.error(t('errors.fillAllFields')); return; }
    try {
      setCreatingProfile(true);
      await createUser(profileData.name, profileData.email);
      toast.success(t('success.profileCreated'));
      setShowProfileForm(false);
      setProfileData({ name: '', email: '' });
    } catch (err) { toast.error(err.message || t('errors.profileCreateFailed')); }
    finally { setCreatingProfile(false); }
  };

  return (
    <div style={{ backgroundColor: 'var(--ibm-white)' }}>
      <Toaster position="top-right" />

      {/* ── HERO ── */}
      <section style={{ borderBottom: '1px solid var(--ibm-gray-20)' }}>
        <div style={{ maxWidth: PAGE_MAX, margin: '0 auto', padding: `${SEC_PY} ${PAGE_PX}`, display: 'grid', gap: '4rem', alignItems: 'center' }} className="hero-grid">
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ibm-blue)', marginBottom: '1.25rem' }}>
              {t('home.heroBadge')}
            </p>
            <h1 style={{ fontFamily: 'IBM Plex Sans', fontWeight: 300, fontSize: 'clamp(2.25rem, 4vw, 3.375rem)', lineHeight: 1.19, color: 'var(--ibm-gray-100)', marginBottom: '1.5rem' }}>
              {t('home.heroTitle')}<br />
              <span style={{ color: 'var(--ibm-blue)', fontWeight: 600 }}>{t('home.heroAccent')}</span>
            </h1>
            <p style={{ fontSize: '1rem', lineHeight: 1.75, color: 'var(--ibm-gray-70)', marginBottom: '2.5rem', maxWidth: '34rem' }}>
              {t('home.heroDesc')}
            </p>
            <div style={{ display: 'flex', gap: '1px', flexWrap: 'wrap' }}>
              <Button renderIcon={ArrowRight} size="lg"
                onClick={() => window.document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })}>
                {t('home.heroBtn')}
              </Button>
              <Button kind="tertiary" size="lg" href="https://www.ibm.com/watsonx" target="_blank" rel="noopener noreferrer">
                {t('home.heroLearn')}
              </Button>
            </div>
          </div>
          <div style={{ backgroundColor: 'var(--ibm-blue)', minHeight: '360px', overflow: 'hidden' }}>
            <img
              src={ibmBg}
              alt="IBM eye bee M brand mark"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', minHeight: '360px' }}
            />
          </div>
        </div>
      </section>

      {/* ── PROFILE BANNER ── */}
      {!user && (
        <section style={{ backgroundColor: '#edf5ff', borderBottom: '1px solid #d0e2ff' }}>
          <div style={{ maxWidth: PAGE_MAX, margin: '0 auto', padding: `2rem ${PAGE_PX}` }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' }}>
              <div>
                <p style={{ fontWeight: 600, color: 'var(--ibm-gray-100)', marginBottom: '0.25rem' }}>{t('home.profileBannerTitle')}</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--ibm-gray-70)' }}>{t('home.profileBannerDesc')}</p>
              </div>
              {!showProfileForm && (
                <Button size="md" onClick={() => setShowProfileForm(true)} style={{ flexShrink: 0 }}>
                  {t('profile.createProfileBtn')}
                </Button>
              )}
            </div>
            {showProfileForm && (
              <div style={{ marginTop: '1.5rem', maxWidth: '30rem' }}>
                <form onSubmit={handleCreateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <TextInput id="profile-name" labelText={t('profile.nameLabel')} placeholder={t('profile.namePlaceholder')}
                    value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    required disabled={creatingProfile} />
                  <TextInput id="profile-email" labelText={t('profile.emailLabel')} type="email" placeholder={t('profile.emailPlaceholder')}
                    value={profileData.email} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    required disabled={creatingProfile} />
                  <div style={{ display: 'flex', gap: '1px', marginTop: '0.5rem' }}>
                    <Button type="submit" disabled={creatingProfile} size="md">
                      {creatingProfile ? t('profile.saving') : t('profile.createProfileBtn')}
                    </Button>
                    <Button kind="ghost" onClick={() => { setShowProfileForm(false); setProfileData({ name: '', email: '' }); }}
                      disabled={creatingProfile} size="md">{t('profile.cancel')}</Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── STEP 1 ── */}
      <section id="upload-section" style={{ borderBottom: '1px solid var(--ibm-gray-20)' }}>
        <div style={{ maxWidth: PAGE_MAX, margin: '0 auto', padding: `${SEC_PY} ${PAGE_PX}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <StepBadge n="1" />
            <div>
              <h2 style={{ fontFamily: 'IBM Plex Sans', fontWeight: 600, fontSize: '1.75rem', color: 'var(--ibm-gray-100)', margin: 0 }}>{t('home.step1Title')}</h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--ibm-gray-60)', margin: '0.25rem 0 0' }}>{t('home.step1Desc')}</p>
            </div>
          </div>
          <FileUpload onFileSelect={handleFileSelect} disabled={uploading || loading} />
          {uploading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1.5rem' }}>
              <Loading small withOverlay={false} />
              <span style={{ fontSize: '0.875rem', color: 'var(--ibm-gray-70)' }}>{t('home.step1Desc')}</span>
            </div>
          )}
        </div>
      </section>

      {/* ── STEP 2 ── */}
      {uploadedDoc && (
        <section style={{ backgroundColor: 'var(--ibm-gray-10)', borderBottom: '1px solid var(--ibm-gray-20)' }}>
          <div style={{ maxWidth: PAGE_MAX, margin: '0 auto', padding: `${SEC_PY} ${PAGE_PX}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <StepBadge n="2" />
              <div>
                <h2 style={{ fontFamily: 'IBM Plex Sans', fontWeight: 600, fontSize: '1.75rem', color: 'var(--ibm-gray-100)', margin: 0 }}>{t('home.step2Title')}</h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--ibm-gray-60)', margin: '0.25rem 0 0' }}>{t('home.step2Desc')}</p>
              </div>
            </div>
            <SummaryModeSelector selectedMode={selectedMode} onModeChange={setSelectedMode} disabled={loading} />
            <div style={{ display: 'flex', gap: '1px', marginTop: '2.5rem' }}>
              <Button renderIcon={ArrowRight} onClick={handleGenerateSummary} disabled={loading || !selectedMode} size="lg">
                {loading ? t('home.generatingBtn') : t('home.generateBtn')}
              </Button>
              <Button kind="secondary" onClick={handleReset} disabled={loading} size="lg">{t('home.uploadNewBtn')}</Button>
            </div>
          </div>
        </section>
      )}

      {/* ── LOADING ── */}
      {loading && (
        <section style={{ borderBottom: '1px solid var(--ibm-gray-20)' }}>
          <div style={{ maxWidth: PAGE_MAX, margin: '0 auto', padding: `${SEC_PY} ${PAGE_PX}`, textAlign: 'center' }}>
            <Loading active withOverlay={false} description={t('home.loadingDesc')} />
            <p style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--ibm-gray-60)' }}>{t('home.loadingHint')}</p>
          </div>
        </section>
      )}

      {/* ── STEP 3 ── */}
      {currentSummary && !loading && (
        <section style={{ borderBottom: '1px solid var(--ibm-gray-20)' }}>
          <div style={{ maxWidth: PAGE_MAX, margin: '0 auto', padding: `${SEC_PY} ${PAGE_PX}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <StepBadge n="3" done />
              <div>
                <h2 style={{ fontFamily: 'IBM Plex Sans', fontWeight: 600, fontSize: '1.75rem', color: 'var(--ibm-gray-100)', margin: 0 }}>{t('home.step3Title')}</h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--ibm-gray-60)', margin: '0.25rem 0 0' }}>{t('home.step3Desc')}</p>
              </div>
            </div>
            <SummaryDisplay summary={currentSummary} />
          </div>
        </section>
      )}

      {/* ── EMPTY STATE ── */}
      {!file && !uploadedDoc && !currentSummary && (
        <section style={{ backgroundColor: 'var(--ibm-gray-10)', borderBottom: '1px solid var(--ibm-gray-20)' }}>
          <div style={{ maxWidth: PAGE_MAX, margin: '0 auto', padding: `${SEC_PY} ${PAGE_PX}`, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'IBM Plex Sans', fontWeight: 300, fontSize: '2rem', color: 'var(--ibm-gray-100)', marginBottom: '1rem' }}>{t('home.emptyTitle')}</h3>
            <p style={{ fontSize: '1rem', color: 'var(--ibm-gray-60)', maxWidth: '36rem', lineHeight: 1.7 }}>{t('home.emptyDesc')}</p>
          </div>
        </section>
      )}

      {/* ── CAPABILITIES ── */}
      <section style={{ borderBottom: '1px solid var(--ibm-gray-20)' }}>
        <div style={{ maxWidth: PAGE_MAX, margin: '0 auto', padding: `${SEC_PY} ${PAGE_PX}` }}>
          <h2 style={{ fontFamily: 'IBM Plex Sans', fontWeight: 300, fontSize: 'clamp(1.75rem, 3vw, 2.625rem)', color: 'var(--ibm-gray-100)', marginBottom: '3rem' }}>
            {t('home.capsTitle')}
          </h2>
          <div style={{ display: 'grid', gap: '1px', backgroundColor: 'var(--ibm-gray-20)' }} className="caps-grid">
            {[
              { Icon: LightFilled,        tKey: 'tldr',     cat: 'TL;DR'        },
              { Icon: DocumentMultiple_01,tKey: 'detailed', cat: 'Detailed'     },
              { Icon: List,               tKey: 'bullets',  cat: 'Bullet points'},
              { Icon: Education,          tKey: 'eli5',     cat: 'ELI5'        },
            ].map(({ Icon, tKey, cat }) => (
              <div key={tKey} style={{ backgroundColor: 'var(--ibm-white)', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ibm-gray-60)', margin: 0 }}>{cat}</p>
                <Icon size={32} style={{ color: 'var(--ibm-blue)' }} />
                <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--ibm-gray-100)', margin: 0 }}>{t(`caps.${tKey}.title`)}</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--ibm-gray-70)', lineHeight: 1.6, margin: 0, flex: 1 }}>{t(`caps.${tKey}.desc`)}</p>
                <ArrowRight size={20} style={{ color: 'var(--ibm-blue)' }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ backgroundColor: '#edf5ff', borderBottom: '1px solid #d0e2ff' }}>
        <div style={{ maxWidth: PAGE_MAX, margin: '0 auto', padding: `2rem ${PAGE_PX}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' }}>
          <div>
            <p style={{ fontWeight: 600, color: 'var(--ibm-gray-100)', margin: '0 0 0.25rem' }}>{t('home.ctaBannerTitle')}</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--ibm-gray-70)', margin: 0 }}>{t('home.ctaBannerDesc')}</p>
          </div>
          <Button renderIcon={ArrowRight} size="lg"
            onClick={() => window.document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })}>
            {t('home.ctaBannerBtn')}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
