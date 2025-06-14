import React from 'react';
import { Button } from '../ui/Button';
import { Plus, Download, Settings, Bell } from 'lucide-react';

interface DashboardHeaderProps {
  onAddCertificate: () => void;
  onExportData?: () => void;
  onOpenSettings?: () => void;
  userName?: string;
  notificationCount?: number;
}

export function DashboardHeader({ 
  onAddCertificate, 
  onExportData,
  onOpenSettings,
  userName,
  notificationCount = 0
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-200">
          {userName ? `Welcome back, ${userName}` : 'Dashboard'}
        </h1>
        <p className="text-gray-400 mt-1">
          Manage your certificates and credentials
        </p>
      </div>
      
      <div className="flex items-center space-x-3">
        {/* Notifications */}
        {notificationCount > 0 && (
          <div className="relative">
            <Button variant="ghost" size="sm" className="p-2">
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </Button>
          </div>
        )}

        {/* Export Data */}
        {onExportData && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onExportData}
            className="hidden sm:flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
        )}

        {/* Settings */}
        {onOpenSettings && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onOpenSettings}
            className="p-2"
          >
            <Settings className="w-5 h-5" />
          </Button>
        )}

        {/* Add Certificate */}
        <Button 
          onClick={onAddCertificate} 
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Certificate</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>
    </div>
  );
}
