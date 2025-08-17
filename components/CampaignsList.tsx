'use client';

import { useState } from 'react';
import type { Campaign } from '@/types';

interface CampaignsListProps {
  campaigns: Campaign[];
}

export default function CampaignsList({ campaigns }: CampaignsListProps) {
  const [sendingCampaign, setSendingCampaign] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'badge-success';
      case 'scheduled':
        return 'badge-info';
      case 'draft':
        return 'badge-warning';
      case 'paused':
        return 'badge-danger';
      default:
        return 'badge-warning';
    }
  };

  const handleSendTest = async (campaignId: string) => {
    const testEmail = prompt('Enter email address for test send:');
    if (!testEmail) return;

    setSendingCampaign(campaignId);
    try {
      const response = await fetch('/api/campaigns/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campaign_id: campaignId,
          test_email: testEmail
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send test email');
      }

      const result = await response.json();
      alert(`Test email sent successfully to ${testEmail}`);
    } catch (error) {
      console.error('Error sending test email:', error);
      alert('Failed to send test email');
    } finally {
      setSendingCampaign(null);
    }
  };

  const handleSendCampaign = async (campaignId: string) => {
    const confirmed = confirm('Are you sure you want to send this campaign to all targeted contacts?');
    if (!confirmed) return;

    setSendingCampaign(campaignId);
    try {
      const response = await fetch('/api/campaigns/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campaign_id: campaignId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send campaign');
      }

      const result = await response.json();
      alert(`Campaign sent! ${result.sent_count} emails sent successfully.`);
      
      // Refresh the page to update campaign status
      window.location.reload();
    } catch (error) {
      console.error('Error sending campaign:', error);
      alert('Failed to send campaign');
    } finally {
      setSendingCampaign(null);
    }
  };

  if (campaigns.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="text-6xl mb-4">📮</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No campaigns found
        </h3>
        <p className="text-gray-500 mb-6">
          Create your first email campaign to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {campaigns.map((campaign) => (
        <div key={campaign.id} className="card">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-2">
                <h3 className="text-lg font-medium text-gray-900">
                  {campaign.title}
                </h3>
                <span className={`badge ${getStatusColor(campaign.metadata.status)}`}>
                  {campaign.metadata.status}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Template:</span>{' '}
                  {campaign.metadata.template?.title || 'No template'}
                </div>
                
                <div>
                  <span className="font-medium">Send Date:</span>{' '}
                  {campaign.metadata.send_date
                    ? new Date(campaign.metadata.send_date).toLocaleDateString()
                    : 'Not scheduled'
                  }
                </div>
                
                <div>
                  <span className="font-medium">Target Tags:</span>{' '}
                  {campaign.metadata.target_tags && campaign.metadata.target_tags.length > 0
                    ? campaign.metadata.target_tags.join(', ')
                    : 'All subscribers'
                  }
                </div>
              </div>
              
              {campaign.metadata.notes && (
                <div className="mt-3 text-sm text-gray-500">
                  <span className="font-medium">Notes:</span> {campaign.metadata.notes}
                </div>
              )}
            </div>
            
            <div className="flex space-x-2">
              {campaign.metadata.status !== 'sent' && (
                <>
                  <button
                    onClick={() => handleSendTest(campaign.id)}
                    disabled={sendingCampaign === campaign.id}
                    className="btn btn-secondary text-sm"
                  >
                    {sendingCampaign === campaign.id ? 'Sending...' : 'Send Test'}
                  </button>
                  
                  <button
                    onClick={() => handleSendCampaign(campaign.id)}
                    disabled={sendingCampaign === campaign.id}
                    className="btn btn-success text-sm"
                  >
                    {sendingCampaign === campaign.id ? 'Sending...' : 'Send Campaign'}
                  </button>
                </>
              )}
              
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
  );
}