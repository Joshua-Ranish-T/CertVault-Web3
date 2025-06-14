import { useState, useCallback, useEffect } from 'react';
import { Certificate } from '../types/certificate';

interface UseCertificatePreviewOptions {
  onPreviewClose?: () => void;
  onPreviewComplete?: (certificate: Certificate) => void;
  onPreviewEdit?: (certificate: Certificate) => void;
}

export function useCertificatePreview(options: UseCertificatePreviewOptions = {}) {
  const [previewCertificate, setPreviewCertificate] = useState<Certificate | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const openPreview = useCallback((certificate: Certificate) => {
    console.log('Opening certificate preview for:', certificate.id);
    setPreviewCertificate(certificate);
    setIsPreviewOpen(true);
  }, []);

  const closePreview = useCallback(() => {
    console.log('Closing certificate preview');
    setIsPreviewOpen(false);
    setPreviewCertificate(null);
    options.onPreviewClose?.();
  }, [options.onPreviewClose]);

  const handlePreviewComplete = useCallback((certificate: Certificate) => {
    console.log('Certificate preview completed for:', certificate.id);
    options.onPreviewComplete?.(certificate);
    closePreview();
  }, [options.onPreviewComplete, closePreview]);

  const handlePreviewEdit = useCallback(() => {
    if (previewCertificate) {
      console.log('Editing certificate from preview:', previewCertificate.id);
      options.onPreviewEdit?.(previewCertificate);
      closePreview();
    }
  }, [previewCertificate, options.onPreviewEdit, closePreview]);

  // Update preview certificate when it changes externally
  const updatePreviewCertificate = useCallback((updatedCertificate: Certificate) => {
    if (previewCertificate && previewCertificate.id === updatedCertificate.id) {
      console.log('Updating preview certificate:', updatedCertificate.id);
      setPreviewCertificate(updatedCertificate);
    }
  }, [previewCertificate]);

  // Debug logging
  useEffect(() => {
    console.log('Certificate preview state changed:', {
      isOpen: isPreviewOpen,
      certificateId: previewCertificate?.id,
      certificateTitle: previewCertificate?.title
    });
  }, [isPreviewOpen, previewCertificate]);

  return {
    previewCertificate,
    isPreviewOpen,
    openPreview,
    closePreview,
    handlePreviewComplete,
    handlePreviewEdit,
    updatePreviewCertificate
  };
}
