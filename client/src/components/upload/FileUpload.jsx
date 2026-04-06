import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { DocumentAdd, TrashCan, DocumentAttachment } from '@carbon/icons-react';
import { Button, InlineNotification } from '@carbon/react';
import { validateFile, formatFileSize } from '../../utils/fileValidation';

const FileUpload = ({ onFileSelect, disabled = false }) => {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    setError(null);
    if (acceptedFiles.length === 0) { setError(t('upload.noFileSelected')); return; }
    const file = acceptedFiles[0];
    const validation = validateFile(file);
    if (!validation.valid) { setError(validation.error); return; }
    setSelectedFile(file);
    onFileSelect(file);
  }, [onFileSelect, t]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'text/plain': ['.txt'] },
    maxFiles: 1,
    disabled,
  });

  const removeFile = () => { setSelectedFile(null); setError(null); onFileSelect(null); };

  return (
    <div>
      {!selectedFile ? (
        <div
          {...getRootProps()}
          style={{
            border: `2px dashed ${isDragActive ? 'var(--ibm-blue)' : 'var(--ibm-gray-30)'}`,
            backgroundColor: isDragActive ? 'var(--ibm-blue-10)' : 'var(--ibm-gray-10)',
            padding: '4rem 2rem',
            textAlign: 'center',
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s',
            opacity: disabled ? 0.5 : 1,
          }}
          onMouseEnter={(e) => { if (!disabled && !isDragActive) e.currentTarget.style.borderColor = 'var(--ibm-blue)'; }}
          onMouseLeave={(e) => { if (!isDragActive) e.currentTarget.style.borderColor = 'var(--ibm-gray-30)'; }}
        >
          <input {...getInputProps()} />
          <DocumentAdd size={48} style={{ color: isDragActive ? 'var(--ibm-blue)' : 'var(--ibm-gray-50)', margin: '0 auto 1rem' }} />
          <p style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--ibm-gray-100)', marginBottom: '0.5rem', fontFamily: 'IBM Plex Sans' }}>
            {isDragActive ? t('upload.dragActive') : t('upload.dragDefault')}
          </p>
          <p style={{ fontSize: '0.875rem', color: 'var(--ibm-gray-60)', marginBottom: '1.5rem' }}>
            {t('upload.browseLink')}
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--ibm-gray-50)' }}>
            {t('upload.supportedFormats')}
          </p>
        </div>
      ) : (
        <div style={{ backgroundColor: 'var(--ibm-white)', border: '1px solid var(--ibm-gray-20)', borderLeft: '4px solid #24a148', padding: '1.25rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <DocumentAttachment size={32} style={{ color: '#24a148', flexShrink: 0 }} />
              <div>
                <p style={{ fontWeight: 600, color: 'var(--ibm-gray-100)', margin: '0 0 0.125rem', fontFamily: 'IBM Plex Sans' }}>
                  {selectedFile.name}
                </p>
                <p style={{ fontSize: '0.8125rem', color: 'var(--ibm-gray-60)', margin: 0 }}>
                  {formatFileSize(selectedFile.size)} · {t('upload.readyStatus')}
                </p>
              </div>
            </div>
            <Button kind="ghost" size="sm" renderIcon={TrashCan} iconDescription={t('upload.removeAriaLabel')} onClick={removeFile} disabled={disabled}>
              {t('upload.removeBtn')}
            </Button>
          </div>
        </div>
      )}

      {error && (
        <div style={{ marginTop: '0.5rem' }}>
          <InlineNotification kind="error" title={t('upload.errorTitle')} subtitle={error} onCloseButtonClick={() => setError(null)} />
        </div>
      )}
    </div>
  );
};

export default FileUpload;
