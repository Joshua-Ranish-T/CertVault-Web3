import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Upload, 
  FolderOpen, 
  Share2, 
  Settings, 
  Award,
  Search,
  BarChart3
} from 'lucide-react';
import { cn } from '../../utils/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'All Certificates', href: '/certificates', icon: Award },
  { name: 'Upload New', href: '/upload', icon: Upload },
  { name: 'Categories', href: '/categories', icon: FolderOpen },
  { name: 'Portfolio', href: '/portfolio', icon: Share2 },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Search', href: '/search', icon: Search },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <Award className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">CertVault</h1>
        </div>
      </div>
      
      <nav className="px-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              )
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
