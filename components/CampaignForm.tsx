'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { CampaignFormData, CampaignStatus, EmailTemplate } from '@/types';

interface CampaignFormProps {
  templates: EmailTemplate[];
}

export default function CampaignForm({ templates }: CampaignFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [formData, setFormData] = useState<CampaignFormData>({
    name: '',
    template_id: '',
    status: 'draft',
    send_date: '',
    target_tags: [],
    notes: ''
  });

  const availableTags = ['Newsletter', 'Promotions', 'Product Updates', 'VIP'];

  const handleTemplateChange = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    setSelectedTemplate(template || null);
    setFormData(prev => ({ ...prev, template_id: templateId }));
  };

  const handleTagChange = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      target_tags: prev.target_tags?.includes(tag)
        ? prev.target_tags.filter(t => t !== tag)
        : [...(prev.target_tags || []), tag]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create campaign');
      }

      router.push('/campaigns');
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  if (templates.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📧</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No templates available
        </h3>
        <p className="text-gray-500 mb-6">
          Create an email template first before launching campaigns
        </p>
        <button
          onClick={() => router.push('/templates/new')}
          className="btn btn-primary"
        >
          Create Template
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Form Section */}
      <div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="form-label">Campaign Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="form-input"
              placeholder="Monthly Newsletter Campaign"
            />
          </div>

          <div>
            <label className="form-label">Email Template *</label>
            <select
              value={formData.template_id}
              onChange={(e) => handleTemplateChange(e.target.value)}
              className="form-input"
              required
            >
              <option value="">Select a template</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Campaign Status *</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as CampaignStatus }))}
              className="form-input"
              required
            >
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="paused">Paused</option>
            </select>
          </div>

          <div>
            <label className="form-label">Send Date</label>
            <input
              type="date"
              value={formData.send_date}
              onChange={(e) => setFormData(prev => ({ ...prev, send_date: e.target.value }))}
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label">Target Audience</label>
            <p className="text-sm text-gray-500 mb-3">
              Select tags to target specific groups, or leave empty to target all subscribed contacts
            </p>
            <div className="grid grid-cols-2 gap-3">
              {availableTags.map((tag) => (
                <label key={tag} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.target_tags?.includes(tag) || false}
                    onChange={() => handleTagChange(tag)}
                    className="rounded border-gray-300 text-primary focus:ring-primary mr-2"
                  />
                  <span className="text-sm text-gray-700">{tag}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="form-label">Campaign Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="form-input h-24"
              placeholder="Internal notes about this campaign..."
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.name || !formData.template_id}
              className="btn btn-primary"
            >
              {loading ? 'Creating...' : 'Create Campaign'}
            </button>
          </div>
        </form>
      </div>

      {/* Template Preview Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Template Preview</h3>
        
        {selectedTemplate ? (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 text-sm text-gray-600">
              <div className="font-medium">{selectedTemplate.title}</div>
              <div>Subject: {selectedTemplate.metadata.subject}</div>
            </div>
            <iframe
              srcDoc={selectedTemplate.metadata.html_content}
              className="w-full h-96"
              title="Template Preview"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-center">
              <div className="text-4xl mb-4">📧</div>
              <p className="text-gray-500">
                Select a template to see preview
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}