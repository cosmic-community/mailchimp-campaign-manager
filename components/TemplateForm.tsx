'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { TemplateFormData, TemplateCategory } from '@/types';

export default function TemplateForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [formData, setFormData] = useState<TemplateFormData>({
    name: '',
    subject: '',
    html_content: '',
    category: 'newsletter'
  });
  const [aiPrompt, setAiPrompt] = useState('');

  const handleGenerateWithAI = async () => {
    if (!aiPrompt.trim()) {
      alert('Please enter a prompt for AI generation');
      return;
    }

    setGenerating(true);
    try {
      const response = await fetch('/api/templates/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: aiPrompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate template');
      }

      const data = await response.json();
      setFormData(prev => ({
        ...prev,
        html_content: data.html_content
      }));
      
      // Clear the prompt after successful generation
      setAiPrompt('');
    } catch (error) {
      console.error('Error generating template:', error);
      alert('Failed to generate template');
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create template');
      }

      router.push('/templates');
    } catch (error) {
      console.error('Error creating template:', error);
      alert('Failed to create template');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Form Section */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Template Details</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="form-label">Template Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="form-input"
              placeholder="Monthly Newsletter"
            />
          </div>

          <div>
            <label className="form-label">Subject Line *</label>
            <input
              type="text"
              required
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              className="form-input"
              placeholder="Your Monthly Update is Here!"
            />
          </div>

          <div>
            <label className="form-label">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as TemplateCategory }))}
              className="form-input"
            >
              <option value="newsletter">Newsletter</option>
              <option value="promotional">Promotional</option>
              <option value="transactional">Transactional</option>
              <option value="announcement">Announcement</option>
            </select>
          </div>

          {/* AI Generation Section */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              AI Template Generation
            </h3>
            <div className="space-y-4">
              <div>
                <label className="form-label">Describe your email template</label>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="form-input h-24"
                  placeholder="Create a professional newsletter template with a header, content sections for company updates and featured articles, and a footer with social links..."
                />
              </div>
              <button
                type="button"
                onClick={handleGenerateWithAI}
                disabled={generating || !aiPrompt.trim()}
                className="btn btn-secondary"
              >
                {generating ? 'Generating...' : '🤖 Generate with AI'}
              </button>
            </div>
          </div>

          <div>
            <label className="form-label">HTML Content *</label>
            <textarea
              required
              value={formData.html_content}
              onChange={(e) => setFormData(prev => ({ ...prev, html_content: e.target.value }))}
              className="form-input h-64"
              placeholder="<html><head>...</head><body>...</body></html>"
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
              disabled={loading || !formData.name || !formData.subject || !formData.html_content}
              className="btn btn-primary"
            >
              {loading ? 'Creating...' : 'Create Template'}
            </button>
          </div>
        </form>
      </div>

      {/* Preview Section */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Live Preview</h2>
        
        {formData.html_content ? (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 text-sm text-gray-600">
              Subject: {formData.subject || 'No subject entered'}
            </div>
            <iframe
              srcDoc={formData.html_content}
              className="w-full h-96"
              title="Template Preview"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-center">
              <div className="text-4xl mb-4">📧</div>
              <p className="text-gray-500">
                Enter HTML content or use AI generation to see preview
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}