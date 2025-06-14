import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Award, Shield } from 'lucide-react';

export function Header() {
  const { connected, publicKey } = useWallet();

  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-purple-500" />
              <Award className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-200">CertVault</h1>
              <p className="text-xs text-gray-400">Decentralized Certificate Storage</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {connected && publicKey && (
              <div className="hidden sm:block text-right">
                <p className="text-sm text-gray-400">Connected</p>
                <p className="text-xs text-gray-500 font-mono">
                  {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
                </p>
              </div>
            )}
            <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700 !rounded-lg !text-sm !font-medium !px-4 !py-2" />
          </div>
        </div>
      </div>
    </header>
  );
}
