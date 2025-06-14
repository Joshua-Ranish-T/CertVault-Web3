import React from 'react';
import { Certificate } from '../../types/certificate';
import { CertificateCard } from './CertificateCard';

interface CertificateGridProps {
  certificates: Certificate[];
  onView: (certificate: Certificate) => void;
  onEdit: (certificate: Certificate) => void;
  onDelete?: (id: string) => void;
  onToggleVisibility: (id: string, isPublic: boolean) => void;
  loading?: boolean;
  emptyMessage?: string;
}

export function CertificateGrid({
  certificates,
  onView,
  onEdit,
  onDelete,
  onToggleVisibility,
  loading = false,
  emptyMessage = "No certificates found"
}: CertificateGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-lg p-6 animate-pulse"
          >
            <div className="flex items-start space-x-3 mb-4">
              <div className="w-12 h-12 bg-gray-700 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-700 rounded"></div>
              <div className="h-3 bg-gray-700 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (certificates.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-300 mb-2">
          {emptyMessage}
        </h3>
        <p className="text-gray-400">
          Start by adding your first certificate to build your digital portfolio.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {certificates.map((certificate) => (
        <CertificateCard
          key={certificate.id}
          certificate={certificate}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleVisibility={onToggleVisibility}
        />
      ))}
    </div>
  );
}
