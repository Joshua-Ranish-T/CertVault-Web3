import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-gray-600 text-gray-200';
      case 'success':
        return 'bg-green-600 text-green-100';
      case 'warning':
        return 'bg-yellow-600 text-yellow-100';
      case 'danger':
        return 'bg-red-600 text-red-100';
      case 'info':
        return 'bg-blue-600 text-blue-100';
      default:
        return 'bg-purple-600 text-purple-100';
    }
  };

  return (
    <span
      className={`
        inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
        ${getVariantClasses()}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
