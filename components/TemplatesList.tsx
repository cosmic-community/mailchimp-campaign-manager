'use client';

import { useState } from 'react';
import type { EmailTemplate } from '@/types';

interface TemplatesListProps {
  templates: EmailTemplate[];
}

export default function TemplatesList({ templates }: TemplatesListProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'newsletter':
        return 'badge-info';
      case 'promotional':
        return 'badge-success';
      case 'transactional':
        return 'badge-warning';
      case 'announcement':
        return 'badge-danger';
      default:
        return 'badge-info';
    }
  };

  if (templates.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="text-6xl mb-4">📧</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No templates found
        </h3>
        <p className="text-gray-500 mb-6">
          Create your first email template to get started
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className="card cursor-pointer hover:shadow-lg transition-shadow duration-200"
            onClick={() => setSelectedTemplate(template)}
          >
            {template.metadata.preview_image && (
              <div className="mb-4">
                <img
                  src={`${template.metadata.preview_image.imgix_url}?w=400&h=200&fit=crop&auto=format,compress`}
                  alt={template.title}
                  className="w-full h-40 object-cover rounded-lg"
                  width={400}
                  height={200}
                />
              </div>
            )}
            
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-medium text-gray-900">
                {template.title}
              </h3>
              {template.metadata.category && (
                <span className={`badge ${getCategoryColor(template.metadata.category.key)}`}>
                  {template.metadata.category.value}
                </span>
              )}
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              {template.metadata.subject}
            </p>
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">
                {new Date(template.created_at).toLocaleDateString()}
              </span>
              <div className="flex space-x-2">
                <button className="text-primary hover:text-primary-dark text-sm">
                  Edit
                </button>
                <button className="text-red-600 hover:text-red-900 text-sm">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Template Preview Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedTemplate.title}
              </h2>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  <strong>Subject:</strong> {selectedTemplate.metadata.subject}
                </p>
              </div>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <iframe
                  srcDoc={selectedTemplate.metadata.html_content}
                  className="w-full h-96"
                  title="Template Preview"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}