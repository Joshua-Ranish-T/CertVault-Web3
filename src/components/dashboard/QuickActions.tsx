import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  Upload, 
  Share2, 
  QrCode, 
  FileText, 
  Award,
  Eye,
  Download,
  Settings
} from 'lucide-react';

interface QuickActionsProps {
  onAddCertificate: () => void;
  onViewPortfolio: () => void;
  onGenerateQR?: () => void;
  onExportData?: () => void;
  onBulkUpload?: () => void;
  onSharePortfolio?: () => void;
}

export function QuickActions({
  onAddCertificate,
  onViewPortfolio,
  onGenerateQR,
  onExportData,
  onBulkUpload,
  onSharePortfolio
}: QuickActionsProps) {
  const actions = [
    {
      title: 'Add Certificate',
      description: 'Upload a new certificate',
      icon: Upload,
      onClick: onAddCertificate,
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      title: 'View Portfolio',
      description: 'See your public portfolio',
      icon: Eye,
      onClick: onViewPortfolio,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      title: 'Share Portfolio',
      description: 'Share your portfolio link',
      icon: Share2,
      onClick: onSharePortfolio,
      color: 'bg-green-600 hover:bg-green-700',
      disabled: !onSharePortfolio
    },
    {
      title: 'Generate QR',
      description: 'Create QR code for portfolio',
      icon: QrCode,
      onClick: onGenerateQR,
      color: 'bg-yellow-600 hover:bg-yellow-700',
      disabled: !onGenerateQR
    },
    {
      title: 'Export Data',
      description: 'Download your certificates',
      icon: Download,
      onClick: onExportData,
      color: 'bg-gray-600 hover:bg-gray-700',
      disabled: !onExportData
    },
    {
      title: 'Bulk Upload',
      description: 'Upload multiple certificates',
      icon: FileText,
      onClick: onBulkUpload,
      color: 'bg-orange-600 hover:bg-orange-700',
      disabled: !onBulkUpload
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Award className="w-5 h-5 text-purple-400" />
          <span>Quick Actions</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="ghost"
              onClick={action.onClick}
              disabled={action.disabled}
              className={`
                h-auto p-4 flex flex-col items-center space-y-2 text-center
                border border-gray-600 hover:border-gray-500
                ${action.disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <action.icon className="w-6 h-6 text-gray-300" />
              <div>
                <p className="text-sm font-medium text-gray-200">
                  {action.title}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {action.description}
                </p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
