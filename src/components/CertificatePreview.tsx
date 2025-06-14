import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Certificate } from '../types/certificate';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { generateQRCode, downloadQRCode } from '../services/qrService';
import { 
  X, 
  Calendar, 
  Building, 
  FileText, 
  QrCode, 
  Share2, 
  Download,
  ExternalLink,
  Award,
  Clock,
  Edit,
  Check,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface CertificatePreviewProps {
  certificate: Certificate;
  onClose: () => void;
  onEdit?: () => void;
  onComplete?: (certificate: Certificate) => void;
  isEditing?: boolean;
}

export const CertificatePreview = React.memo(function CertificatePreview({ 
  certificate, 
  onClose, 
  onEdit, 
  onComplete,
  isEditing = false 
}: CertificatePreviewProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [shareStatus, setShareStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Memoize certificate verification URL to prevent unnecessary recalculations
  const verificationUrl = useMemo(() => {
    return certificate.verificationId 
      ? `${window.location.origin}/verify/${certificate.verificationId}`
      : null;
  }, [certificate.verificationId]);

  // Generate QR code when certificate or verification ID changes
  const generateQRCodeForCertificate = useCallback(async () => {
    if (!certificate.verificationId) {
      setQrCodeUrl('');
      return;
    }
    
    setIsGeneratingQR(true);
    try {
      console.log('Generating QR code for verification ID:', certificate.verificationId);
      const qrUrl = await generateQRCode(certificate.verificationId);
      setQrCodeUrl(qrUrl);
      console.log('QR code generated successfully');
    } catch (error) {
      console.error('Failed to generate QR code:', error);
      setQrCodeUrl('');
    } finally {
      setIsGeneratingQR(false);
    }
  }, [certificate.verificationId]);

  // Effect to generate QR code when certificate changes
  useEffect(() => {
    console.log('Certificate changed, regenerating QR code...', {
      id: certificate.id,
      verificationId: certificate.verificationId,
      title: certificate.title
    });
    generateQRCodeForCertificate();
  }, [generateQRCodeForCertificate]);

  const handleDownloadQR = useCallback(async () => {
    if (!certificate.verificationId) {
      console.warn('No verification ID available for QR download');
      return;
    }
    
    setIsDownloading(true);
    try {
      await downloadQRCode(certificate.verificationId, certificate.title);
      console.log('QR code downloaded successfully');
    } catch (error) {
      console.error('Failed to download QR code:', error);
    } finally {
      setIsDownloading(false);
    }
  }, [certificate.verificationId, certificate.title]);

  const handleShareLink = useCallback(async () => {
    if (!verificationUrl) {
      console.warn('No verification URL available for sharing');
      return;
    }
    
    try {
      await navigator.clipboard.writeText(verificationUrl);
      setShareStatus('success');
      console.log('Verification link copied to clipboard');
      
      // Reset status after 3 seconds
      setTimeout(() => setShareStatus('idle'), 3000);
    } catch (error) {
      console.error('Failed to copy link to clipboard:', error);
      setShareStatus('error');
      setTimeout(() => setShareStatus('idle'), 3000);
    }
  }, [verificationUrl]);

  const handleComplete = useCallback(() => {
    console.log('Completing certificate preview for:', certificate.id);
    if (onComplete) {
      onComplete(certificate);
    }
  }, [onComplete, certificate]);

  const handleEdit = useCallback(() => {
    console.log('Editing certificate:', certificate.id);
    if (onEdit) {
      onEdit();
    }
  }, [onEdit]);

  // Memoize formatted dates to prevent recalculation
  const formattedDates = useMemo(() => {
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    return {
      issueDate: formatDate(certificate.issueDate),
      expiryDate: certificate.expiryDate ? formatDate(certificate.expiryDate) : null
    };
  }, [certificate.issueDate, certificate.expiryDate]);

  // Memoize status badge variant
  const statusBadgeVariant = useMemo(() => {
    switch (certificate.status?.toLowerCase()) {
      case 'active':
        return 'success';
      case 'expired':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  }, [certificate.status]);

  // Memoize category color
  const categoryColor = useMemo(() => {
    const colors = {
      'Professional': 'bg-blue-600',
      'Academic': 'bg-green-600',
      'Technical': 'bg-purple-600',
      'Personal': 'bg-orange-600',
      'education': 'bg-green-600',
      'professional': 'bg-blue-600',
      'technical': 'bg-purple-600',
      'personal': 'bg-orange-600',
      'other': 'bg-gray-600'
    };
    return colors[certificate.category as keyof typeof colors] || 'bg-gray-600';
  }, [certificate.category]);

  // Debug logging for component updates
  useEffect(() => {
    console.log('CertificatePreview component updated with certificate:', {
      id: certificate.id,
      title: certificate.title,
      verificationId: certificate.verificationId,
      status: certificate.status,
      category: certificate.category,
      timestamp: new Date().toISOString()
    });
  }, [certificate]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <Award className="h-6 w-6 text-purple-400" />
            <h2 className="text-xl font-semibold text-gray-200">
              {isEditing ? 'Edit Certificate' : 'Certificate Preview'}
            </h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Certificate Card */}
          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-600">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-2xl text-gray-100">
                    {certificate.title}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    {certificate.status && (
                      <Badge variant={statusBadgeVariant}>
                        {certificate.status}
                      </Badge>
                    )}
                    <Badge className={`${categoryColor} text-white`}>
                      {certificate.category}
                    </Badge>
                  </div>
                </div>
                {certificate.fileUrl && (
                  <div className="text-right">
                    <FileText className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Issuer Information */}
              <div className="flex items-center space-x-3">
                <Building className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-400">Issued by</p>
                  <p className="text-gray-200 font-medium">{certificate.issuingOrganization}</p>
                </div>
              </div>

              {/* Date Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Issue Date</p>
                    <p className="text-gray-200">{formattedDates.issueDate}</p>
                  </div>
                </div>
                {formattedDates.expiryDate && (
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">Expiry Date</p>
                      <p className="text-gray-200">{formattedDates.expiryDate}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              {certificate.description && (
                <div>
                  <p className="text-sm text-gray-400 mb-2">Description</p>
                  <p className="text-gray-200 leading-relaxed">{certificate.description}</p>
                </div>
              )}

              {/* Skills */}
              {certificate.skills && certificate.skills.length > 0 && (
                <div>
                  <p className="text-sm text-gray-400 mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {certificate.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Credential ID */}
              {certificate.credentialId && (
                <div>
                  <p className="text-sm text-gray-400 mb-1">Credential ID</p>
                  <p className="text-gray-200 font-mono text-sm">{certificate.credentialId}</p>
                </div>
              )}

              {/* Notes */}
              {certificate.notes && (
                <div>
                  <p className="text-sm text-gray-400 mb-2">Notes</p>
                  <p className="text-gray-200 text-sm leading-relaxed">{certificate.notes}</p>
                </div>
              )}

              {/* Verification Information */}
              {certificate.verificationId && (
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Verification Details</h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-400">Verification ID</p>
                      <p className="text-sm text-gray-200 font-mono break-all">
                        {certificate.verificationId}
                      </p>
                    </div>
                    {certificate.transactionHash && (
                      <div>
                        <p className="text-xs text-gray-400">Transaction Hash</p>
                        <p className="text-sm text-gray-200 font-mono break-all">
                          {certificate.transactionHash}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* QR Code Section */}
              {certificate.verificationId && (
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Verification QR Code</h4>
                  <div className="flex items-center space-x-4">
                    {qrCodeUrl ? (
                      <img 
                        src={qrCodeUrl} 
                        alt="Verification QR Code" 
                        className="w-24 h-24 bg-white rounded-lg p-2"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gray-700 rounded-lg flex items-center justify-center">
                        {isGeneratingQR ? (
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400"></div>
                        ) : (
                          <QrCode className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm text-gray-300 mb-2">
                        Scan to verify this certificate
                      </p>
                      <div className="flex space-x-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={handleDownloadQR}
                          disabled={!qrCodeUrl || isDownloading}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          {isDownloading ? 'Downloading...' : 'Download'}
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={handleShareLink}
                          disabled={!verificationUrl}
                        >
                          <Share2 className="h-4 w-4 mr-1" />
                          {shareStatus === 'success' ? 'Copied!' : 'Copy Link'}
                        </Button>
                      </div>
                      {shareStatus === 'success' && (
                        <div className="flex items-center mt-2 text-green-400 text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Link copied to clipboard
                        </div>
                      )}
                      {shareStatus === 'error' && (
                        <div className="flex items-center mt-2 text-red-400 text-xs">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Failed to copy link
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-700">
            <div className="flex space-x-3">
              {onEdit && (
                <Button variant="secondary" onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Certificate
                </Button>
              )}
              {verificationUrl && (
                <Button 
                  variant="ghost" 
                  onClick={() => window.open(verificationUrl, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Public Page
                </Button>
              )}
            </div>
            
            <div className="flex space-x-3">
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              {onComplete && (
                <Button onClick={handleComplete}>
                  <Check className="h-4 w-4 mr-2" />
                  {isEditing ? 'Save Changes' : 'Confirm Certificate'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
