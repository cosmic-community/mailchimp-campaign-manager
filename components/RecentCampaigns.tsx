import Link from 'next/link';
import type { Campaign } from '@/types';

interface RecentCampaignsProps {
  campaigns: Campaign[];
}

export default function RecentCampaigns({ campaigns }: RecentCampaignsProps) {
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

  if (campaigns.length === 0) {
    return (
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Recent Campaigns
        </h2>
        <p className="text-gray-500 text-center py-8">
          No campaigns found. Create your first campaign to get started!
        </p>
        <div className="text-center">
          <Link
            href="/campaigns/new"
            className="btn btn-primary"
          >
            Create Campaign
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Recent Campaigns
        </h2>
        <Link
          href="/campaigns"
          className="text-primary hover:text-primary-dark text-sm font-medium"
        >
          View all
        </Link>
      </div>
      
      <div className="space-y-4">
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-1">
                {campaign.title}
              </h3>
              <p className="text-sm text-gray-500">
                {campaign.metadata.template?.title || 'No template'}
              </p>
              {campaign.metadata.send_date && (
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(campaign.metadata.send_date).toLocaleDateString()}
                </p>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <span className={`badge ${getStatusColor(campaign.metadata.status.key)}`}>
                {campaign.metadata.status.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}