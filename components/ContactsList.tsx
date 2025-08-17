'use client';

import { useState } from 'react';
import type { Contact } from '@/types';

interface ContactsListProps {
  contacts: Contact[];
}

export default function ContactsList({ contacts }: ContactsListProps) {
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredContacts = contacts.filter(contact => {
    if (filterStatus === 'all') return true;
    return contact.metadata.status === filterStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'subscribed':
        return 'badge-success';
      case 'unsubscribed':
        return 'badge-danger';
      case 'pending':
        return 'badge-warning';
      default:
        return 'badge-warning';
    }
  };

  if (contacts.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="text-6xl mb-4">👥</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No contacts found
        </h3>
        <p className="text-gray-500 mb-6">
          Import contacts or add them individually to get started
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Contacts ({filteredContacts.length})
        </h2>
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="form-input w-auto"
        >
          <option value="all">All Statuses</option>
          <option value="subscribed">Subscribed</option>
          <option value="unsubscribed">Unsubscribed</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tags
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredContacts.map((contact) => (
              <tr key={contact.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {contact.metadata.first_name && contact.metadata.last_name
                        ? `${contact.metadata.first_name} ${contact.metadata.last_name}`
                        : contact.metadata.email
                      }
                    </div>
                    <div className="text-sm text-gray-500">
                      {contact.metadata.email}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`badge ${getStatusColor(contact.metadata.status)}`}>
                    {contact.metadata.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-wrap gap-1">
                    {contact.metadata.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="badge badge-info"
                      >
                        {tag}
                      </span>
                    )) || (
                      <span className="text-sm text-gray-400">No tags</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-primary hover:text-primary-dark mr-3">
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}