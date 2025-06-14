import React, { useState } from 'react';
import { useCertificates } from '../contexts/CertificateContext';
import { useWallet } from '@solana/wallet-adapter-react';
import { CertificateGrid } from '../components/certificates/CertificateGrid';
import { CertificatePreview } from '../components/CertificatePreview';
import { CertificateForm } from '../components/CertificateForm';
import { StatsCard } from '../components/dashboard/StatsCard';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Certificate } from '../types/certificate';
import { 
  Plus, 
  Award, 
  TrendingUp, 
  Clock, 
  AlertTriangle,
  Search,
  Filter
} from 'lucide-react';

export function Dashboard() {
  const { connected } = useWallet();
  const { 
    certificates, 
    stats, 
    loading, 
    updateCertificate, 
    deleteCertificate 
  } = useCertificates();
  
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const handleViewCertificate = (certificate: Certificate) => {
    console.log('Viewing certificate:', certificate);
    setSelectedCertificate(certificate);
  };

  const handleEditCertificate = (certificate: Certificate) => {
    console.log('Editing certificate:', certificate);
    setEditingCertificate(certificate);
    setShowForm(true);
  };

  const handleDeleteCertificate = async (id: string) => {
    try {
      await deleteCertificate(id);
      console.log('Certificate deleted successfully');
    } catch (error) {
      console.error('Failed to delete certificate:', error);
    }
  };

  const handleToggleVisibility = async (id: string, isPublic: boolean) => {
    try {
      await updateCertificate(id, { isPublic });
      console.log('Certificate visibility updated');
    } catch (error) {
      console.error('Failed to update certificate visibility:', error);
    }
  };

  const handleClosePreview = () => {
    setSelectedCertificate(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCertificate(null);
  };

  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cert.issuingOrganization.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cert.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || cert.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(certificates.map(cert => cert.category)))];

  if (!connected) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="text-center py-8">
            <Award className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-200 mb-2">
              Connect Your Wallet
            </h2>
            <p className="text-gray-400 mb-4">
              Please connect your Solana wallet to access your certificate dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-100 mb-2">
              Certificate Dashboard
            </h1>
            <p className="text-gray-400">
              Manage your digital certificates and achievements
            </p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Certificate
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Certificates"
            value={stats.totalCertificates}
            icon={Award}
            color="purple"
          />
          <StatsCard
            title="Active Certificates"
            value={certificates.filter(c => !c.expirationDate || new Date(c.expirationDate) > new Date()).length}
            icon={TrendingUp}
            color="green"
          />
          <StatsCard
            title="Expiring Soon"
            value={stats.upcomingRenewals.length}
            icon={Clock}
            color="yellow"
          />
          <StatsCard
            title="Expired"
            value={stats.expiredCertificates.length}
            icon={AlertTriangle}
            color="red"
          />
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search certificates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="text-gray-400 w-4 h-4" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Certificates Grid */}
        <CertificateGrid
          certificates={filteredCertificates}
          onView={handleViewCertificate}
          onEdit={handleEditCertificate}
          onDelete={handleDeleteCertificate}
          onToggleVisibility={handleToggleVisibility}
          loading={loading}
          emptyMessage={
            searchQuery || filterCategory !== 'all' 
              ? "No certificates match your search criteria"
              : "No certificates found. Add your first certificate to get started!"
          }
        />

        {/* Certificate Preview Modal */}
        {selectedCertificate && (
          <CertificatePreview
            certificate={selectedCertificate}
            onClose={handleClosePreview}
            onEdit={() => handleEditCertificate(selectedCertificate)}
          />
        )}

        {/* Certificate Form Modal */}
        {showForm && (
          <CertificateForm
            certificate={editingCertificate}
            onClose={handleCloseForm}
          />
        )}
      </div>
    </div>
  );
}
