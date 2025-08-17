'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ContactFormData, ContactStatus } from '@/types';

export default function ContactForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    email: '',
    first_name: '',
    last_name: '',
    status: 'subscribed',
    tags: []
  });

  const availableTags = ['Newsletter', 'Promotions', 'Product Updates', 'VIP'];

  const handleTagChange = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...(prev.tags || []), tag]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create contact');
      }

      router.push('/contacts');
    } catch (error) {
      console.error('Error creating contact:', error);
      alert('Failed to create contact');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="form-label">Email Address *</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="form-input"
            placeholder="contact@example.com"
          />
        </div>

        <div>
          <label className="form-label">Status *</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as ContactStatus }))}
            className="form-input"
            required
          >
            <option value="subscribed">Subscribed</option>
            <option value="unsubscribed">Unsubscribed</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div>
          <label className="form-label">First Name</label>
          <input
            type="text"
            value={formData.first_name || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
            className="form-input"
            placeholder="John"
          />
        </div>

        <div>
          <label className="form-label">Last Name</label>
          <input
            type="text"
            value={formData.last_name || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
            className="form-input"
            placeholder="Doe"
          />
        </div>
      </div>

      <div>
        <label className="form-label">Tags</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {availableTags.map((tag) => (
            <label key={tag} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.tags?.includes(tag) || false}
                onChange={() => handleTagChange(tag)}
                className="rounded border-gray-300 text-primary focus:ring-primary mr-2"
              />
              <span className="text-sm text-gray-700">{tag}</span>
            </label>
          ))}
        </div>
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
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? 'Creating...' : 'Create Contact'}
        </button>
      </div>
    </form>
  );
}