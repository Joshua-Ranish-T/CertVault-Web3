import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Certificate, CertificateStats, CertificateCategory } from '../types/certificate';
import { useWallet } from '@solana/wallet-adapter-react';
import { storeCertificateOnChain, getCertificatesFromChain } from '../services/solanaService';

interface CertificateContextType {
  certificates: Certificate[];
  stats: CertificateStats;
  loading: boolean;
  addCertificate: (certificate: Omit<Certificate, 'id' | 'createdAt' | 'updatedAt' | 'walletAddress' | 'verificationId'>) => Promise<Certificate>;
  updateCertificate: (id: string, updates: Partial<Certificate>) => Promise<Certificate | null>;
  deleteCertificate: (id: string) => Promise<void>;
  getCertificateById: (id: string) => Certificate | undefined;
  getCertificatesByCategory: (category: CertificateCategory) => Certificate[];
  searchCertificates: (query: string) => Certificate[];
  refreshCertificates: () => Promise<void>;
}

const CertificateContext = createContext<CertificateContextType | undefined>(undefined);

export function useCertificates() {
  const context = useContext(CertificateContext);
  if (!context) {
    throw new Error('useCertificates must be used within a CertificateProvider');
  }
  return context;
}

interface CertificateProviderProps {
  children: ReactNode;
}

export function CertificateProvider({ children }: CertificateProviderProps) {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(false);
  const { publicKey, connected } = useWallet();

  const generateStats = useCallback((certs: Certificate[]): CertificateStats => {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const categoriesBreakdown = certs.reduce((acc, cert) => {
      acc[cert.category] = (acc[cert.category] || 0) + 1;
      return acc;
    }, {} as Record<CertificateCategory, number>);

    const upcomingRenewals = certs.filter(cert => 
      cert.expirationDate && 
      new Date(cert.expirationDate) <= thirtyDaysFromNow &&
      new Date(cert.expirationDate) > now
    );

    const expiredCertificates = certs.filter(cert =>
      cert.expirationDate && new Date(cert.expirationDate) < now
    );

    const recentActivity = certs
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    return {
      totalCertificates: certs.length,
      categoriesBreakdown,
      recentActivity,
      upcomingRenewals,
      expiredCertificates
    };
  }, []);

  const [stats, setStats] = useState<CertificateStats>({
    totalCertificates: 0,
    categoriesBreakdown: {} as Record<CertificateCategory, number>,
    recentActivity: [],
    upcomingRenewals: [],
    expiredCertificates: []
  });

  const updateStatsAndCertificates = useCallback((newCertificates: Certificate[]) => {
    console.log('Updating certificates and stats:', newCertificates.length);
    setCertificates(newCertificates);
    const newStats = generateStats(newCertificates);
    setStats(newStats);
    console.log('Updated stats:', newStats);
  }, [generateStats]);

  const refreshCertificates = useCallback(async () => {
    if (!connected || !publicKey) {
      console.log('Wallet not connected, clearing certificates');
      updateStatsAndCertificates([]);
      return;
    }
    
    setLoading(true);
    try {
      console.log('Refreshing certificates for wallet:', publicKey.toString());
      const certs = await getCertificatesFromChain(publicKey.toString());
      console.log('Loaded certificates from chain:', certs);
      updateStatsAndCertificates(certs);
    } catch (error) {
      console.error('Failed to load certificates:', error);
      updateStatsAndCertificates([]);
    } finally {
      setLoading(false);
    }
  }, [connected, publicKey, updateStatsAndCertificates]);

  useEffect(() => {
    refreshCertificates();
  }, [refreshCertificates]);

  const addCertificate = useCallback(async (certificateData: Omit<Certificate, 'id' | 'createdAt' | 'updatedAt' | 'walletAddress' | 'verificationId'>): Promise<Certificate> => {
    if (!connected || !publicKey) {
      throw new Error('Wallet not connected');
    }

    console.log('=== STARTING CERTIFICATE CREATION ===');
    console.log('Input data:', certificateData);

    const certificate: Certificate = {
      ...certificateData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      walletAddress: publicKey.toString(),
      verificationId: crypto.randomUUID(),
      status: 'active' // Ensure status is set
    };

    console.log('Complete certificate object to store:', certificate);

    try {
      console.log('Storing certificate on blockchain...');
      const transactionHash = await storeCertificateOnChain(certificate);
      console.log('Blockchain storage successful, transaction hash:', transactionHash);
      
      certificate.transactionHash = transactionHash;
      
      console.log('Updating local state immediately...');
      const updatedCerts = [...certificates, certificate];
      updateStatsAndCertificates(updatedCerts);
      
      console.log('Local state updated, new certificate count:', updatedCerts.length);
      console.log('=== CERTIFICATE CREATION COMPLETED ===');
      
      return certificate;
    } catch (error) {
      console.error('=== CERTIFICATE CREATION FAILED ===');
      console.error('Error details:', error);
      throw error;
    }
  }, [connected, publicKey, certificates, updateStatsAndCertificates]);

  const updateCertificate = useCallback(async (id: string, updates: Partial<Certificate>): Promise<Certificate | null> => {
    console.log('Updating certificate:', id, updates);
    
    const certificateIndex = certificates.findIndex(cert => cert.id === id);
    if (certificateIndex === -1) {
      console.warn('Certificate not found for update:', id);
      return null;
    }

    const updatedCertificate = {
      ...certificates[certificateIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    const updatedCerts = [...certificates];
    updatedCerts[certificateIndex] = updatedCertificate;
    
    updateStatsAndCertificates(updatedCerts);
    
    console.log('Certificate updated successfully:', updatedCertificate);
    return updatedCertificate;
  }, [certificates, updateStatsAndCertificates]);

  const deleteCertificate = useCallback(async (id: string): Promise<void> => {
    console.log('Deleting certificate:', id);
    const updatedCerts = certificates.filter(cert => cert.id !== id);
    updateStatsAndCertificates(updatedCerts);
    console.log('Certificate deleted successfully');
  }, [certificates, updateStatsAndCertificates]);

  const getCertificateById = useCallback((id: string) => {
    return certificates.find(cert => cert.id === id);
  }, [certificates]);

  const getCertificatesByCategory = useCallback((category: CertificateCategory) => {
    return certificates.filter(cert => cert.category === category);
  }, [certificates]);

  const searchCertificates = useCallback((query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return certificates.filter(cert =>
      cert.title.toLowerCase().includes(lowercaseQuery) ||
      cert.description.toLowerCase().includes(lowercaseQuery) ||
      cert.issuingOrganization.toLowerCase().includes(lowercaseQuery) ||
      cert.category.toLowerCase().includes(lowercaseQuery)
    );
  }, [certificates]);

  // Debug logging for context state changes
  useEffect(() => {
    console.log('Certificate context state updated:', {
      certificateCount: certificates.length,
      loading,
      connected,
      walletAddress: publicKey?.toString()
    });
  }, [certificates.length, loading, connected, publicKey]);

  return (
    <CertificateContext.Provider value={{
      certificates,
      stats,
      loading,
      addCertificate,
      updateCertificate,
      deleteCertificate,
      getCertificateById,
      getCertificatesByCategory,
      searchCertificates,
      refreshCertificates
    }}>
      {children}
    </CertificateContext.Provider>
  );
}
