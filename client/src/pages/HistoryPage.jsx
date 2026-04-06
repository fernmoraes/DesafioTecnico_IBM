import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Time, CopyFile, Checkmark, Close } from '@carbon/icons-react';
import { Button, Tag, Loading } from '@carbon/react';
import { useUser } from '../context/UserContext';
import { useSummary } from '../context/SummaryContext';
import { formatDate, formatNumber, formatProcessingTime, calculateCompressionRatio, truncateText } from '../utils/formatters';

const PAGE_MAX = '1312px';
const PAGE_PX  = 'clamp(1rem, 5vw, 5rem)';

const modeColors = { tldr: 'blue', detailed: 'purple', bullets: 'teal', eli5: 'green' };

const SummaryModal = ({ summary, onClose }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const modeKey = summary.mode?.toLowerCase();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary.summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) { console.error('Failed to copy:', err); }
  };

  const modal = (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}
      onClick={onClose}>
      <div style={{ backgroundColor: 'var(--ibm-white)', width: '100%', maxWidth: '48rem', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
        onClick={(e) => e.stopPropagation()}>
        {/* Modal header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--ibm-gray-20)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Tag type={modeColors[modeKey] || 'blue'} size="md">{t(`modes.${modeKey}.label`, summary.mode)}</Tag>
            <span style={{ fontSize: '0.875rem', color: 'var(--ibm-gray-60)' }}>{formatDate(summary.createdAt)}</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button kind="ghost" size="sm" renderIcon={copied ? Checkmark : CopyFile} onClick={handleCopy}>
              {copied ? t('history.copied') : t('history.copy')}
            </Button>
            <Button kind="ghost" size="sm" renderIcon={Close} iconDescription="Close" hasIconOnly onClick={onClose} />
          </div>
        </div>
        {/* Modal body */}
        <div style={{ padding: '1.5rem', flex: 1, overflowY: 'auto' }}>
          {summary.mode === 'bullets' ? (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {summary.summaryText.split('\n').filter(l => l.trim()).map((line, i) => (
                <li key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <span style={{ color: 'var(--ibm-blue)', fontWeight: 700, flexShrink: 0 }}>—</span>
                  <p style={{ color: 'var(--ibm-gray-90)', margin: 0, lineHeight: 1.7 }}>{line.replace(/^-\s*/, '')}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: 'var(--ibm-gray-90)', whiteSpace: 'pre-wrap', lineHeight: 1.7, margin: 0 }}>{summary.summaryText}</p>
          )}
        </div>
        {/* Stats */}
        <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--ibm-gray-20)', backgroundColor: 'var(--ibm-gray-10)', flexShrink: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            {[
              { labelKey: 'history.originalWords',  value: formatNumber(summary.originalWordCount),                                              color: 'var(--ibm-gray-100)' },
              { labelKey: 'history.summaryWords',   value: formatNumber(summary.summaryWordCount),                                               color: 'var(--ibm-gray-100)' },
              { labelKey: 'history.compression',    value: calculateCompressionRatio(summary.originalWordCount, summary.summaryWordCount),        color: '#24a148' },
              { labelKey: 'history.processingTime', value: formatProcessingTime(summary.processingTime),                                         color: 'var(--ibm-blue)' },
            ].map((stat) => (
              <div key={stat.labelKey}>
                <p style={{ fontSize: '0.75rem', color: 'var(--ibm-gray-60)', marginBottom: '0.25rem' }}>{t(stat.labelKey)}</p>
                <p style={{ fontSize: '1.25rem', fontWeight: 700, color: stat.color, margin: 0 }}>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

const HistoryPage = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const { summaries, loading, loadHistory } = useSummary();
  const [selectedSummary, setSelectedSummary] = useState(null);

  useEffect(() => { if (user) loadHistory(user.id); }, [user]);

  return (
    <div>
      {selectedSummary && <SummaryModal summary={selectedSummary} onClose={() => setSelectedSummary(null)} />}

      <section style={{ borderBottom: '1px solid var(--ibm-gray-20)', backgroundColor: 'var(--ibm-white)' }}>
        <div style={{ maxWidth: PAGE_MAX, margin: '0 auto', padding: `3rem ${PAGE_PX} 2.5rem` }}>
          <h1 style={{ fontFamily: 'IBM Plex Sans', fontWeight: 300, fontSize: 'clamp(1.75rem, 3vw, 2.625rem)', color: 'var(--ibm-gray-100)', marginBottom: '0.5rem' }}>
            {t('history.pageTitle')}
          </h1>
          <p style={{ color: 'var(--ibm-gray-60)', margin: 0, fontSize: '1rem' }}>{t('history.pageDesc')}</p>
        </div>
      </section>

      <section style={{ backgroundColor: 'var(--ibm-gray-10)', minHeight: '60vh' }}>
        <div style={{ maxWidth: PAGE_MAX, margin: '0 auto', padding: `3rem ${PAGE_PX}` }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '20rem' }}>
              <Loading description={t('history.loading')} withOverlay={false} />
            </div>
          ) : !summaries || summaries.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 0' }}>
              <Time size={48} style={{ color: 'var(--ibm-gray-30)', marginBottom: '1rem' }} />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--ibm-gray-100)', marginBottom: '0.5rem' }}>{t('history.emptyTitle')}</h2>
              <p style={{ color: 'var(--ibm-gray-60)' }}>{t('history.emptyDesc')}</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
              {summaries.map((summary) => {
                const modeKey = summary.mode?.toLowerCase();
                return (
                  <div key={summary.id} onClick={() => setSelectedSummary(summary)}
                    style={{ backgroundColor: 'var(--ibm-white)', borderLeft: '4px solid var(--ibm-blue)', padding: '1.25rem 1.5rem', cursor: 'pointer', transition: 'background-color 0.15s' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--ibm-blue-10)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--ibm-white)'}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.625rem', flexWrap: 'wrap' }}>
                          <Tag type={modeColors[modeKey] || 'blue'} size="sm">{t(`modes.${modeKey}.label`, summary.mode)}</Tag>
                          <span style={{ fontSize: '0.8125rem', color: 'var(--ibm-gray-60)' }}>{formatDate(summary.createdAt)}</span>
                        </div>
                        <p style={{ color: 'var(--ibm-gray-80)', margin: '0 0 0.625rem', lineHeight: 1.6, fontSize: '0.9375rem' }}>
                          {truncateText(summary.summaryText, 200)}
                        </p>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--ibm-gray-50)', margin: 0 }}>
                          {summary.originalWordCount} → {summary.summaryWordCount} {t('history.summaryWords').toLowerCase()} · {summary.compressionRatio}% {t('history.compression').toLowerCase()}
                        </p>
                      </div>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--ibm-blue)', whiteSpace: 'nowrap', flexShrink: 0 }}>{t('history.view')}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HistoryPage;
