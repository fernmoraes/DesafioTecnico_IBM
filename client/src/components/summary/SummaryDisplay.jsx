import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CopyFile, Checkmark } from '@carbon/icons-react';
import { Button } from '@carbon/react';
import { SUMMARY_MODE_LABELS } from '../../utils/constants';
import { formatNumber, formatProcessingTime, calculateCompressionRatio } from '../../utils/formatters';

const SummaryDisplay = ({ summary }) => {
  const { t } = useTranslation();
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

  const modeKey = summary.mode?.toLowerCase();
  const modeLabel = t(`modes.${modeKey}.label`, SUMMARY_MODE_LABELS[summary.mode]);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--ibm-gray-100)', margin: 0, fontFamily: 'IBM Plex Sans' }}>
          {t('summary.modeSummary', { mode: modeLabel })}
        </h3>
        <Button kind="ghost" size="sm" renderIcon={copied ? Checkmark : CopyFile} onClick={handleCopy}>
          {copied ? t('summary.copied') : t('summary.copyText')}
        </Button>
      </div>

      <div style={{ backgroundColor: 'var(--ibm-white)', border: '1px solid var(--ibm-gray-20)', borderLeft: '4px solid var(--ibm-blue)', padding: '1.5rem', marginBottom: '1px' }}>
        {summary.mode === 'bullets' ? (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {summary.summaryText.split('\n').filter(line => line.trim()).map((line, index) => (
              <li key={index} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <span style={{ color: 'var(--ibm-blue)', fontWeight: 700, flexShrink: 0 }}>—</span>
                <p style={{ color: 'var(--ibm-gray-90)', margin: 0, lineHeight: 1.7, fontFamily: 'IBM Plex Sans' }}>
                  {line.replace(/^-\s*/, '')}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: 'var(--ibm-gray-90)', whiteSpace: 'pre-wrap', lineHeight: 1.8, margin: 0, fontFamily: 'IBM Plex Sans', fontSize: '1rem' }}>
            {summary.summaryText}
          </p>
        )}
      </div>

      <div style={{ backgroundColor: 'var(--ibm-gray-100)', padding: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }} className="md:grid-cols-4">
          {[
            { labelKey: 'summary.originalWords',  value: formatNumber(summary.originalWordCount),                                                    color: 'var(--ibm-white)' },
            { labelKey: 'summary.summaryWords',   value: formatNumber(summary.summaryWordCount),                                                     color: 'var(--ibm-white)' },
            { labelKey: 'summary.compression',    value: calculateCompressionRatio(summary.originalWordCount, summary.summaryWordCount),              color: '#42be65' },
            { labelKey: 'summary.processingTime', value: formatProcessingTime(summary.processingTime),                                               color: '#78a9ff' },
          ].map((stat) => (
            <div key={stat.labelKey} style={{ borderLeft: '2px solid var(--ibm-gray-70)', paddingLeft: '1rem' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--ibm-gray-40)', margin: '0 0 0.25rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {t(stat.labelKey)}
              </p>
              <p style={{ fontSize: '1.75rem', fontWeight: 700, color: stat.color, margin: 0, fontFamily: 'IBM Plex Sans' }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SummaryDisplay;
