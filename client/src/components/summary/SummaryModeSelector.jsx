import { SUMMARY_MODES, SUMMARY_MODE_LABELS, SUMMARY_MODE_DESCRIPTIONS } from '../../utils/constants';
import Card from '../common/Card';

const SummaryModeSelector = ({ selectedMode, onModeChange, disabled = false }) => {
  const modes = [
    { value: SUMMARY_MODES.TLDR, icon: '⚡' },
    { value: SUMMARY_MODES.DETAILED, icon: '📄' },
    { value: SUMMARY_MODES.BULLETS, icon: '📋' },
    { value: SUMMARY_MODES.ELI5, icon: '🎓' },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900">Choose Summary Type</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modes.map((mode) => (
          <Card
            key={mode.value}
            padding={false}
            hover={!disabled}
            className={`
              cursor-pointer transition-all duration-200
              ${selectedMode === mode.value
                ? 'ring-2 ring-primary-500 border-primary-500'
                : 'border border-gray-200 hover:border-primary-300'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <label className="flex items-start gap-4 p-4 cursor-pointer">
              <input
                type="radio"
                name="summaryMode"
                value={mode.value}
                checked={selectedMode === mode.value}
                onChange={(e) => onModeChange(e.target.value)}
                disabled={disabled}
                className="mt-1 w-4 h-4 text-primary-600 focus:ring-primary-500"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{mode.icon}</span>
                  <span className="font-semibold text-gray-900">
                    {SUMMARY_MODE_LABELS[mode.value]}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {SUMMARY_MODE_DESCRIPTIONS[mode.value]}
                </p>
              </div>
            </label>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SummaryModeSelector;

// Made with Bob
