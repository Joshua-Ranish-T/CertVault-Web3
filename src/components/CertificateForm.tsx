import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Textarea } from './ui/Textarea';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { useCertificates } from '../contexts/CertificateContext';
import { CertificateCategory } from '../types/certificate';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';

interface CertificateFormProps {
  onClose?: () => void;
  onSuccess?: () => void;
}

export function CertificateForm({ onClose, onSuccess }: CertificateFormProps) {
  const { addCertificate, loading } = useCertificates();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    issuingOrganization: '',
    category: 'education' as CertificateCategory,
    issueDate: '',
    expirationDate: '',
    credentialId: '',
    skills: '',
    notes: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const categories: { value: CertificateCategory; label: string }[] = [
    { value: 'education', label: 'Education' },
    { value: 'professional', label: 'Professional' },
    { value: 'technical', label: 'Technical' },
    { value: 'personal', label: 'Personal' },
    { value: 'other', label: 'Other' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Check file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, file: 'File size must be less than 10MB' }));
        return;
      }
      setFile(selectedFile);
      setErrors(prev => ({ ...prev, file: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.issuingOrganization.trim()) {
      newErrors.issuingOrganization = 'Issuing organization is required';
    }
    if (!formData.issueDate) {
      newErrors.issueDate = 'Issue date is required';
    }
    if (formData.expirationDate && formData.issueDate && 
        new Date(formData.expirationDate) <= new Date(formData.issueDate)) {
      newErrors.expirationDate = 'Expiration date must be after issue date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSubmitting(true);
    setSubmitStatus('idle');
    setErrors({});

    try {
      console.log('Starting certificate creation...', formData);
      
      const skillsArray = formData.skills
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);

      const certificateData = {
        title: formData.title,
        description: formData.description,
        issuingOrganization: formData.issuingOrganization,
        category: formData.category,
        issueDate: formData.issueDate,
        expirationDate: formData.expirationDate || undefined,
        credentialId: formData.credentialId || undefined,
        skills: skillsArray,
        notes: formData.notes || undefined,
        fileUrl: file ? URL.createObjectURL(file) : undefined,
        fileName: file?.name,
        fileSize: file?.size,
        isPublic: false
      };

      console.log('Certificate data prepared:', certificateData);

      await addCertificate(certificateData);

      console.log('Certificate created successfully!');
      setSubmitStatus('success');

      // Reset form after successful creation
      setFormData({
        title: '',
        description: '',
        issuingOrganization: '',
        category: 'education',
        issueDate: '',
        expirationDate: '',
        credentialId: '',
        skills: '',
        notes: ''
      });
      setFile(null);
      
      // Show success message briefly before closing
      setTimeout(() => {
        onSuccess?.();
        onClose?.();
      }, 1500);

    } catch (error) {
      console.error('Failed to create certificate:', error);
      setSubmitStatus('error');
      setErrors({ 
        submit: error instanceof Error ? error.message : 'Failed to create certificate. Please try again.' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Add New Certificate</CardTitle>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </CardHeader>
      
      <CardContent>
        {submitStatus === 'success' && (
          <div className="mb-4 p-3 bg-green-900/20 border border-green-500 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <p className="text-sm text-green-400">Certificate created successfully!</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Certificate Title *"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              error={errors.title}
              placeholder="e.g., AWS Solutions Architect"
            />
            
            <Select
              label="Category *"
              value={formData.category}
              onChange={(value) => handleInputChange('category', value)}
              options={categories}
            />
          </div>

          <Input
            label="Issuing Organization *"
            value={formData.issuingOrganization}
            onChange={(e) => handleInputChange('issuingOrganization', e.target.value)}
            error={errors.issuingOrganization}
            placeholder="e.g., Amazon Web Services"
          />

          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Brief description of the certificate..."
            rows={3}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Issue Date *"
              type="date"
              value={formData.issueDate}
              onChange={(e) => handleInputChange('issueDate', e.target.value)}
              error={errors.issueDate}
            />
            
            <Input
              label="Expiration Date"
              type="date"
              value={formData.expirationDate}
              onChange={(e) => handleInputChange('expirationDate', e.target.value)}
              error={errors.expirationDate}
            />
          </div>

          <Input
            label="Credential ID"
            value={formData.credentialId}
            onChange={(e) => handleInputChange('credentialId', e.target.value)}
            placeholder="Certificate ID or number"
          />

          <Input
            label="Skills (comma-separated)"
            value={formData.skills}
            onChange={(e) => handleInputChange('skills', e.target.value)}
            placeholder="e.g., Cloud Architecture, AWS, DevOps"
          />

          <Textarea
            label="Personal Notes"
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="Personal notes about this certificate..."
            rows={2}
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-200">
              Certificate File
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-gray-200 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Choose File</span>
              </label>
              {file && (
                <span className="text-sm text-gray-400">
                  {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              )}
            </div>
            {errors.file && (
              <p className="text-sm text-red-400">{errors.file}</p>
            )}
          </div>

          {errors.submit && (
            <div className="p-3 bg-red-900/20 border border-red-500 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-sm text-red-400">{errors.submit}</p>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            {onClose && (
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
            )}
            <Button 
              type="submit" 
              disabled={submitting || loading}
              className="min-w-[120px]"
            >
              {submitting ? 'Creating...' : 'Create Certificate'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
