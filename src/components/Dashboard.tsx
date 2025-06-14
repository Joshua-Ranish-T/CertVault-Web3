import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { CertificateCard } from './CertificateCard';
import { CertificateForm } from './CertificateForm';
import { useCertificates } from '../contexts/CertificateContext';
import { useWallet } from '@solana/wallet-adapter-react';
import { 
  Plus, 
  Award, 
  AlertTriangle, 
  Clock, 
  TrendingUp,
  Search,
  Filter
} from 'lucide-react';

export function Dashboard() {
  const { certificates, stats, loading } = useCertificates();
  const { connected } = useWallet();
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cert.issuingOrganization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || cert.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!connected) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="pt-6">
            <Award className="w-16 h-16 text-purple-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-200 mb-2">
              Connect Your Wallet
            </h2>
            <p className="text-gray-400 mb-4">
              Please connect your Solana wallet to access your certificates.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="min-h-screen bg-gray-900 p-4">
        <div className="max-w-4xl mx-auto">
          <CertificateForm 
            onClose={() => setShowForm(false)}
            onSuccess={() => setShowForm(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-200">Dashboard</h1>
            <p className="text-gray-400">Manage your certificates and credentials</p>
          </div>
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Certificate
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="flex items-center p-4">
              <Award className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <p className="text-sm text-gray-400">Total Certificates</p>
                <p className="text-2xl font-bold text-gray-200">{stats.totalCertificates}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-4">
              <Clock className="w-8 h-8 text-yellow-500 mr-3" />
              <div>
                <p className="text-sm text-gray-400">Expiring Soon</p>
                <p className="text-2xl font-bold text-gray-200">{stats.upcomingRenewals.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-4">
              <AlertTriangle className="w-8 h-8 text-red-500 mr-3" />
              <div>
                <p className="text-sm text-gray-400">Expired</p>
                <p className="text-2xl font-bold text-gray-200">{stats.expiredCertificates.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-4">
              <TrendingUp className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm text-gray-400">This Month</p>
                <p className="text-2xl font-bold text-gray-200">
                  {certificates.filter(cert => {
                    const certDate = new Date(cert.createdAt);
                    const now = new Date();
                    return certDate.getMonth() === now.getMonth() && 
                           certDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search certificates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Categories</option>
                  <option value="education">Education</option>
                  <option value="professional">Professional</option>
                  <option value="technical">Technical</option>
                  <option value="personal">Personal</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Certificates Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        ) : filteredCertificates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCertificates.map((certificate) => (
              <CertificateCard key={certificate.id} certificate={certificate} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Award className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-400 mb-2">
                {certificates.length === 0 ? 'No certificates yet' : 'No certificates found'}
              </h3>
              <p className="text-gray-500 mb-4">
                {certificates.length === 0 
                  ? 'Start building your digital credential portfolio'
                  : 'Try adjusting your search or filter criteria'
                }
              </p>
              {certificates.length === 0 && (
                <Button onClick={() => setShowForm(true)}>
                  Add Your First Certificate
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Recent Activity */}
        {stats.recentActivity.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.recentActivity.map((cert) => (
                  <div key={cert.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Award className="w-5 h-5 text-purple-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-200">{cert.title}</p>
                        <p className="text-xs text-gray-400">{cert.issuingOrganization}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={cert.category}>
                        {cert.category}
                      </Badge>
                      <span className="text-xs text-gray-400">
                        {new Date(cert.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
