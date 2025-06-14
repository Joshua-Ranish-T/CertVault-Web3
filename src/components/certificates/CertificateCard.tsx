import React from 'react';
import { Certificate } from '../../types/certificate';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { 
  Calendar, 
  Building, 
  Share2, 
  QrCode, 
  Eye, 
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Edit,
  Trash2,
  ExternalLink,
  Download,
  Clock,
  Award,
  FileText
} from 'lucide-react';
import { downloadQRCode } from '../../services/qrService';

interface CertificateCardProps {
  certificate: Certificate;
  onView: (certificate: Certificate) => void;
  onEdit: (certificate: Certificate) => void;
  onDelete?: (id: string) => void;
  onToggleVisibility: (id: string, isPublic: boolean) => void;
  showActions?: boolean;
  compact?: boolean;
}

export function CertificateCard({ 
  certificate, 
  onView, 
  onEdit, 
  onDelete,
  onToggleVisibility,
  showActions = true,
  compact = false
}: CertificateCardProps) {
  const isExpired = certificate.expirationDate && new Date(certificate.expirationDate) < new Date();
  const isExpiringSoon = certificate.expirationDate && 
    new Date(certificate.expirationDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) &&
    !isExpired;

  const handleDownloadQR = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!certificate.verificationId) return;
    
    try {
      await downloadQRCode(certificate.verificationId, certificate.title);
    } catch (error) {
      console.error('Failed to download QR code:', error);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!certificate.verificationId) return;
    
    const verificationUrl = `${window.location.origin}/verify/${certificate.verificationId}`;
    try {
      await navigator.clipboard.writeText(verificationUrl);
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleToggleVisibility = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleVisibility(certificate.id, !certificate.isPublic);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(certificate);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete && window.confirm('Are you sure you want to delete this certificate?')) {
      onDelete(certificate.id);
    }
  };

  const handleView = () => {
    onView(certificate);
  };

  const getStatusBadge = () => {
    if (isExpired) {
      return (
        <Badge variant="danger" className="flex items-center space-x-1">
          <AlertTriangle className="w-3 h-3" />
          <span>Expired</span>
        </Badge>
      );
    }
    if (isExpiringSoon) {
      return (
        <Badge variant="warning" className="flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>Expiring Soon</span>
        </Badge>
      );
    }
    return (
      <Badge variant="success" className="flex items-center space-x-1">
        <CheckCircle className="w-3 h-3" />
        <span>Valid</span>
      </Badge>
    );
  };

  const getCategoryColor = () => {
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
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card 
      className={`
        hover:border-purple-500 transition-all duration-200 cursor-pointer
        ${compact ? 'p-3' : 'p-4'}
        ${isExpired ? 'border-red-500/30 bg-red-900/10' : ''}
        ${isExpiringSoon ? 'border-yellow-500/30 bg-yellow-900/10' : ''}
        hover:shadow-lg hover:shadow-purple-500/20
      `}
      onClick={handleView}
    >
      <CardContent className={compact ? 'p-0' : ''}>
        {/* Header Section */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className={`w-12 h-12 rounded-lg ${getCategoryColor()} flex items-center justify-center`}>
                  <Award className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-200 mb-1 truncate">
                  {certificate.title}
                </h3>
                <div className="flex items-center space-x-2 mb-2">
                  <Badge className={`${getCategoryColor()} text-white text-xs`}>
                    {certificate.category}
                  </Badge>
                  {getStatusBadge()}
                </div>
              </div>
            </div>
          </div>
          
          {/* Visibility Indicator */}
          <div className="flex items-center space-x-2">
            {certificate.isPublic ? (
              <Eye className="w-4 h-4 text-green-400" title="Public" />
            ) : (
              <EyeOff className="w-4 h-4 text-gray-400" title="Private" />
            )}
            {certificate.verificationId && (
              <div className="w-2 h-2 bg-purple-400 rounded-full" title="Blockchain Verified" />
            )}
          </div>
        </div>

        {/* Certificate Details */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Building className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{certificate.issuingOrganization}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span>Issued: {formatDate(certificate.issueDate)}</span>
            </div>
            {certificate.expirationDate && (
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span>Expires: {formatDate(certificate.expirationDate)}</span>
              </div>
            )}
          </div>

          {/* Description Preview */}
          {certificate.description && !compact && (
            <p className="text-sm text-gray-300 line-clamp-2">
              {certificate.description}
            </p>
          )}

          {/* Skills Preview */}
          {certificate.skills && certificate.skills.length > 0 && !compact && (
            <div className="flex flex-wrap gap-1">
              {certificate.skills.slice(0, 3).map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {certificate.skills.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{certificate.skills.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {/* Verification Info */}
          {certificate.verificationId && (
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-300">Blockchain Verified</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDownloadQR}
                    className="p-1 h-auto"
                    title="Download QR Code"
                  >
                    <QrCode className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleShare}
                    className="p-1 h-auto"
                    title="Share Verification Link"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-xs text-gray-400 font-mono truncate">
                  ID: {certificate.verificationId}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="flex items-center justify-between pt-3 border-t border-gray-700">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleVisibility}
                className="text-xs"
              >
                {certificate.isPublic ? (
                  <>
                    <EyeOff className="w-3 h-3 mr-1" />
                    Make Private
                  </>
                ) : (
                  <>
                    <Eye className="w-3 h-3 mr-1" />
                    Make Public
                  </>
                )}
              </Button>
            </div>
            
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleView}
                className="text-xs"
              >
                <FileText className="w-3 h-3 mr-1" />
                View
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEdit}
                className="text-xs"
              >
                <Edit className="w-3 h-3 mr-1" />
                Edit
              </Button>
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete
                </Button>
              )}
            </div>
          </div>
        )}

        {/* File Attachment Indicator */}
        {certificate.fileUrl && (
          <div className="absolute top-2 right-2">
            <FileText className="w-4 h-4 text-gray-400" title="Has attachment" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
