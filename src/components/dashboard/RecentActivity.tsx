import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { 
  Award, 
  Clock, 
  Eye, 
  Share2, 
  MoreHorizontal,
  Calendar,
  Building,
  ExternalLink
} from 'lucide-react';
import { Certificate } from '../../types/certificate';

interface RecentActivityProps {
  activities: Certificate[];
  onViewCertificate: (certificate: Certificate) => void;
  onViewAll?: () => void;
  loading?: boolean;
}

export function RecentActivity({ 
  activities, 
  onViewCertificate, 
  onViewAll,
  loading = false 
}: RecentActivityProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const getActivityIcon = (certificate: Certificate) => {
    const daysSinceCreated = Math.ceil(
      (new Date().getTime() - new Date(certificate.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSinceCreated <= 1) return Award;
    if (certificate.isPublic) return Eye;
    return Share2;
  };

  const getActivityText = (certificate: Certificate) => {
    const daysSinceCreated = Math.ceil(
      (new Date().getTime() - new Date(certificate.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSinceCreated <= 1) return 'Added certificate';
    if (certificate.isPublic) return 'Made public';
    return 'Updated certificate';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex items-center space-x-3 animate-pulse">
                <div className="w-10 h-10 bg-gray-700 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-700 rounded mb-2 w-3/4"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                </div>
                <div className="h-6 bg-gray-700 rounded w-16"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No recent activity</p>
            <p className="text-sm text-gray-500 mt-1">
              Your certificate activities will appear here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-purple-400" />
            <span>Recent Activity</span>
          </CardTitle>
          {onViewAll && activities.length > 3 && (
            <Button variant="ghost" size="sm" onClick={onViewAll}>
              View All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.slice(0, 5).map((certificate) => {
            const ActivityIcon = getActivityIcon(certificate);
            
            return (
              <div
                key={certificate.id}
                className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                onClick={() => onViewCertificate(certificate)}
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                    <ActivityIcon className="w-5 h-5 text-purple-400" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="text-sm font-medium text-gray-200 truncate">
                      {getActivityText(certificate)}
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      {certificate.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-300 truncate mb-1">
                    {certificate.title}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Building className="w-3 h-3" />
                      <span className="truncate max-w-32">
                        {certificate.issuingOrganization}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(certificate.createdAt)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex-shrink-0">
                  <Button variant="ghost" size="sm" className="p-1">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
