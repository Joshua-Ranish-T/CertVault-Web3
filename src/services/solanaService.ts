import { Certificate } from '../types/certificate';

// Mock storage for development
const mockStorage = new Map<string, Certificate[]>();

export async function storeCertificateOnChain(certificate: Certificate): Promise<string> {
  console.log('Storing certificate on chain:', certificate);
  
  // Simulate blockchain transaction delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Get existing certificates for this wallet
  const existingCerts = mockStorage.get(certificate.walletAddress) || [];
  
  // Add new certificate
  existingCerts.push(certificate);
  mockStorage.set(certificate.walletAddress, existingCerts);
  
  // Return mock transaction hash
  const transactionHash = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  console.log('Certificate stored successfully, transaction hash:', transactionHash);
  
  return transactionHash;
}

export async function getCertificatesFromChain(walletAddress: string): Promise<Certificate[]> {
  console.log('Getting certificates from chain for wallet:', walletAddress);
  
  // Simulate blockchain query delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const certificates = mockStorage.get(walletAddress) || [];
  console.log('Retrieved certificates:', certificates);
  
  return certificates;
}

export async function updateCertificateOnChain(certificate: Certificate): Promise<string> {
  console.log('Updating certificate on chain:', certificate);
  
  // Simulate blockchain transaction delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const existingCerts = mockStorage.get(certificate.walletAddress) || [];
  const updatedCerts = existingCerts.map(cert => 
    cert.id === certificate.id ? certificate : cert
  );
  
  mockStorage.set(certificate.walletAddress, updatedCerts);
  
  const transactionHash = `tx_update_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  console.log('Certificate updated successfully, transaction hash:', transactionHash);
  
  return transactionHash;
}

export async function deleteCertificateFromChain(walletAddress: string, certificateId: string): Promise<string> {
  console.log('Deleting certificate from chain:', certificateId);
  
  // Simulate blockchain transaction delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const existingCerts = mockStorage.get(walletAddress) || [];
  const filteredCerts = existingCerts.filter(cert => cert.id !== certificateId);
  
  mockStorage.set(walletAddress, filteredCerts);
  
  const transactionHash = `tx_delete_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  console.log('Certificate deleted successfully, transaction hash:', transactionHash);
  
  return transactionHash;
}
