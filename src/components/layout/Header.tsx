import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Bell, User } from 'lucide-react';
import { Button } from '../ui/Button';
import { useCertificates } from '../../contexts/CertificateContext';

export function Header() {
  const { stats } = useCertificates();

  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-200">
            Welcome to your Certificate Vault
          </h2>
        </div>
        
        <div className="flex items-center space-x-4">
          {stats.upcomingRenewals.length > 0 && (
            <div className="relative">
              <Button variant="ghost" size="sm">
                <Bell className="w-5 h-5" />
              </Button>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {stats.upcomingRenewals.length}
              </span>
            </div>
          )}
          
          <WalletMultiButton className="!bg-purple-600 !rounded-lg" />
        </div>
      </div>
    </header>
  );
}
