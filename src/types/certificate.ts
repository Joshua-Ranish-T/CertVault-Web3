export type CertificateCategory = 'education' | 'professional' | 'technical' | 'personal' | 'other';

export interface Certificate {
  id: string;
  title: string;
  description: string;
  issuingOrganization: string;
  category: CertificateCategory;
  issueDate: string;
  expirationDate?: string;
  credentialId?: string;
  skills: string[];
  notes?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  isPublic: boolean;
  walletAddress: string;
  verificationId: string;
  transactionHash?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CertificateStats {
  totalCertificates: number;
  categoriesBreakdown: Record<CertificateCategory, number>;
  recentActivity: Certificate[];
  upcomingRenewals: Certificate[];
  expiredCertificates: Certificate[];
}
