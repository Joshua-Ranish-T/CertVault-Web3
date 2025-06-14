import React from 'react';
import { StatsCard } from './StatsCard';
import { 
  Award, 
  Clock, 
  AlertTriangle, 
  TrendingUp,
  Eye,
  Share2,
  Calendar,
  CheckCircle
} from 'lucide-react';

interface StatsData {
  totalCertificates: number;
  upcomingRenewals: any[];
  expiredCertificates: any[];
  publicCertificates: number;
  sharedCertificates: number;
  thisMonthCertificates: number;
  verifiedCertificates: number;
  totalViews?: number;
}

interface StatsGridProps {
  stats: StatsData;
  loading?: boolean;
  compact?: boolean;
}

export function StatsGrid({ stats, loading = false, compact = false }: StatsGridProps) {
  const statsCards = [
    {
      title: 'Total Certificates',
      value: stats.totalCertificates,
      icon: Award,
      color: 'purple' as const,
      subtitle: 'All certificates in your vault',
      trend: stats.totalCertificates > 0 ? {
        value: 12,
        isPositive: true
      } : undefined
    },
    {
      title: 'Expiring Soon',
      value: stats.upcomingRenewals.length,
      icon: Clock,
      color: 'yellow' as const,
      subtitle: 'Certificates expiring within 30 days',
    },
    {
      title: 'Expired',
      value: stats.expiredCertificates.length,
      icon: AlertTriangle,
      color: 'red' as const,
      subtitle: 'Certificates that need renewal',
    },
    {
      title: 'This Month',
      value: stats.thisMonthCertificates,
      icon: TrendingUp,
      color: 'green' as const,
      subtitle: 'Certificates added this month',
      trend: stats.thisMonthCertificates > 0 ? {
        value: 25,
        isPositive: true
      } : undefined
    }
  ];

  const additionalStats = [
    {
      title: 'Public Certificates',
      value: stats.publicCertificates || 0,
      icon: Eye,
      color: 'blue' as const,
      subtitle: 'Visible in your public portfolio',
    },
    {
      title: 'Shared',
      value: stats.sharedCertificates || 0,
      icon: Share2,
      color: 'purple' as const,
      subtitle: 'Certificates shared with others',
    },
    {
      title: 'Verified',
      value: stats.verifiedCertificates || 0,
      icon: CheckCircle,
      color: 'green' as const,
      subtitle: 'Blockchain verified certificates',
    },
    {
      title: 'Total Views',
      value: stats.totalViews || 0,
      icon: TrendingUp,
      color: 'blue' as const,
      subtitle: 'Portfolio views this month',
      trend: (stats.totalViews || 0) > 0 ? {
        value: 15,
        isPositive: true
      } : undefined
    }
  ];

  const displayStats = compact ? statsCards.slice(0, 4) : [...statsCards, ...additionalStats];
  const gridCols = compact ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';

  return (
    <div className={`grid ${gridCols} gap-4`}>
      {displayStats.map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
          trend={stat.trend}
          subtitle={stat.subtitle}
          loading={loading}
        />
      ))}
    </div>
  );
}
