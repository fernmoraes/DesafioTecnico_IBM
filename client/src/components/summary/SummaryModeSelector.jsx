import { useTranslation } from 'react-i18next';
import { Flash, DocumentMultiple_01, List, Education } from '@carbon/icons-react';
import { SUMMARY_MODES } from '../../utils/constants';

const modes = [
  { value: SUMMARY_MODES.TLDR,     Icon: Flash,               tKey: 'tldr'     },
  { value: SUMMARY_MODES.DETAILED, Icon: DocumentMultiple_01, tKey: 'detailed' },
  { value: SUMMARY_MODES.BULLETS,  Icon: List,                tKey: 'bullets'  },
  { value: SUMMARY_MODES.ELI5,     Icon: Education,           tKey: 'eli5'     },
];

const SummaryModeSelector = ({ selectedMode, onModeChange, disabled = false }) => {
  const { t } = useTranslation();

  return (
    <div>
      <p style={{ fontSize: '0.875rem', color: 'var(--ibm-gray-60)', marginBottom: '1rem' }}>
        {t('modeSelector.hint')}
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.125rem' }}>
        {modes.map(({ value, Icon, tKey }) => {
          const active = selectedMode === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => !disabled && onModeChange(value)}
              disabled={disabled}
              style={{
                all: 'unset',
                display: 'block',
                padding: '1.25rem 1.5rem',
                cursor: disabled ? 'not-allowed' : 'pointer',
                backgroundColor: active ? 'var(--ibm-blue)' : 'var(--ibm-white)',
                borderLeft: '4px solid var(--ibm-blue)',
                transition: 'background-color 0.15s',
                opacity: disabled ? 0.5 : 1,
              }}
              onMouseEnter={(e) => { if (!disabled && !active) e.currentTarget.style.backgroundColor = 'var(--ibm-blue-10)'; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.backgroundColor = 'var(--ibm-white)'; }}
              aria-pressed={active}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.375rem' }}>
                <Icon size={20} style={{ color: active ? 'var(--ibm-white)' : 'var(--ibm-blue)', flexShrink: 0 }} />
                <span style={{ fontWeight: 600, fontSize: '0.9375rem', color: active ? 'var(--ibm-white)' : 'var(--ibm-gray-100)', fontFamily: 'IBM Plex Sans' }}>
                  {t(`modes.${tKey}.label`)}
                </span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: active ? 'rgba(255,255,255,0.75)' : 'var(--ibm-gray-60)', margin: 0, lineHeight: 1.5 }}>
                {t(`modes.${tKey}.description`)}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SummaryModeSelector;
