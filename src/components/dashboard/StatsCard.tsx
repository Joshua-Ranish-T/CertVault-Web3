import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: 'purple' | 'green' | 'yellow' | 'red' | 'blue';
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
  loading?: boolean;
}

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  trend, 
  subtitle,
  loading = false 
}: StatsCardProps) {
  const getColorClasses = () => {
    switch (color) {
      case 'green':
        return 'text-green-400 bg-green-400/10';
      case 'yellow':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'red':
        return 'text-red-400 bg-red-400/10';
      case 'blue':
        return 'text-blue-400 bg-blue-400/10';
      case 'purple':
      default:
        return 'text-purple-400 bg-purple-400/10';
    }
  };

  const getTrendColor = () => {
    if (!trend) return '';
    return trend.isPositive ? 'text-green-400' : 'text-red-400';
  };

  const formatValue = (val: number) => {
    if (val >= 1000000) {
      return `${(val / 1000000).toFixed(1)}M`;
    }
    if (val >= 1000) {
      return `${(val / 1000).toFixed(1)}K`;
    }
    return val.toString();
  };

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="h-4 bg-gray-700 rounded mb-2 w-3/4"></div>
              <div className="h-8 bg-gray-700 rounded mb-2 w-1/2"></div>
              <div className="h-3 bg-gray-700 rounded w-2/3"></div>
            </div>
            <div className="w-12 h-12 bg-gray-700 rounded-lg"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:border-gray-600 transition-colors duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-400 mb-1">
              {title}
            </p>
            <div className="flex items-baseline space-x-2 mb-2">
              <p className="text-2xl font-bold text-gray-200">
                {formatValue(value)}
              </p>
              {trend && (
                <div className={`flex items-center text-sm ${getTrendColor()}`}>
                  <svg
                    className={`w-4 h-4 mr-1 ${
                      trend.isPositive ? 'rotate-0' : 'rotate-180'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 17l9.2-9.2M17 17V7H7"
                    />
                  </svg>
                  <span className="font-medium">
                    {Math.abs(trend.value)}%
                  </span>
                </div>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-gray-500">
                {subtitle}
              </p>
            )}
          </div>
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses()}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
