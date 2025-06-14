import React, { useState } from 'react';
import { Certificate } from '../types/certificate';
import { Card, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { 
  Calendar, 
  Building, 
  Share2, 
  QrCode, 
  Eye, 
  EyeOff,
  AlertTriangle,
  CheckCircle,
  FileText,
  Download,
  ExternalLink,
  Edit,
  Trash2
} from 'lucide-react';
import { downloadQRCode } from '../services/qrService';
import { CertificatePreview } from './CertificatePreview';
import { useCertificates } from '../contexts/CertificateContext';

interface CertificateCardProps {
  certificate: Certificate;
}

export function CertificateCard({ certificate }: CertificateCardProps) {
  const [showPreview, setShowPreview] = useState(false);
  const { updateCertificate, deleteCertificate } = useCertificates();
  
  const isExpired = certificate.expirationDate && new Date(certificate.expirationDate) < new Date();
  const isExpiringSoon = certificate.expirationDate && 
    new Date(certificate.expirationDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) &&
    !isExpired;

  const handleDownloadQR = async () => {
    try {
      await downloadQRCode(certificate.verificationId, certificate.title);
    } catch (error) {
      console.error('Failed to download QR code:', error);
    }
  };

  const handleToggleVisibility = async () => {
    try {
      await updateCertificate(certificate.id, { isPublic: !certificate.isPublic });
    } catch (error) {
      console.error('Failed to update visibility:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this certificate?')) {
      try {
        await deleteCertificate(certificate.id);
      } catch (error) {
        console.error('Failed to delete certificate:', error);
      }
    }
  };

  const getStatusBadge = () => {
    if (isExpired) {
      return <Badge variant="danger">Expired</Badge>;
    }
    if (isExpiringSoon) {
      return <Badge variant="warning">Expiring Soon</Badge>;
    }
    return <Badge variant="success">Valid</Badge>;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      education: 'bg-blue-500',
      professional: 'bg-green-500',
      technical: 'bg-purple-500',
      personal: 'bg-yellow-500',
      other: 'bg-gray-500'
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  return (
    <>
      <Card className="hover:border-purple-500 transition-all duration-200 hover:shadow-lg">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-200 mb-2 line-clamp-2">
                {certificate.title}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                <div className="flex items-center">
                  <Building className="w-4 h-4 mr-1" />
                  <span className="truncate">{certificate.issuingOrganization}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(certificate.issueDate).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center space-x-2 mb-3">
                <Badge 
                  variant="info" 
                  className={`${getCategoryColor(certificate.category)} text-white`}
                >
                  {certificate.category}
                </Badge>
                {getStatusBadge()}
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleVisibility}
                className="text-gray-400 hover:text-gray-200"
              >
                {certificate.isPublic ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {certificate.description && (
            <p className="text-sm text-gray-400 mb-4 line-clamp-2">
              {certificate.description}
            </p>
          )}

          {certificate.skills && certificate.skills.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {certificate.skills.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded"
                  >
                    {skill}
                  </span>
                ))}
                {certificate.skills.length > 3 && (
                  <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                    +{certificate.skills.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {certificate.expirationDate && (
            <div className="flex items-center text-sm text-gray-400 mb-4">
              {isExpired ? (
                <AlertTriangle className="w-4 h-4 mr-1 text-red-400" />
              ) : isExpiringSoon ? (
                <AlertTriangle className="w-4 h-4 mr-1 text-yellow-400" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-1 text-green-400" />
              )}
              <span>
                Expires: {new Date(certificate.expirationDate).toLocaleDateString()}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-gray-700">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(true)}
                className="text-purple-400 hover:text-purple-300"
              >
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
              
              {certificate.fileUrl && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(certificate.fileUrl, '_blank')}
                  className="text-blue-400 hover:text-blue-300"
                >
                  <FileText className="w-4 h-4 mr-1" />
                  File
                </Button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownloadQR}
                className="text-gray-400 hover:text-gray-200"
              >
                <QrCode className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const verificationUrl = `${window.location.origin}/verify/${certificate.verificationId}`;
                  navigator.clipboard.writeText(verificationUrl);
                }}
                className="text-gray-400 hover:text-gray-200"
              >
                <Share2 className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {certificate.credentialId && (
            <div className="mt-3 pt-3 border-t border-gray-700">
              <p className="text-xs text-gray-500">
                Credential ID: {certificate.credentialId}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {showPreview && (
        <CertificatePreview
          certificate={certificate}
          onClose={() => setShowPreview(false)}
        />
      )}
    </>
  );
}
