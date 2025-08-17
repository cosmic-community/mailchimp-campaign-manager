import Link from 'next/link';
import { getCampaigns } from '@/lib/cosmic';

export default async function RecentCampaigns() {
  const campaigns = await getCampaigns(5);

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

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Recent Campaigns
        </h2>
        <Link
          href="/campaigns"
          className="text-primary hover:text-primary-dark text-sm font-medium"
        >
          View all →
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📮</div>
          <p className="text-gray-500 mb-4">No campaigns yet</p>
          <Link
            href="/campaigns/new"
            className="btn btn-primary"
          >
            Create Your First Campaign
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-1">
                  {campaign.title}
                </h3>
                <p className="text-sm text-gray-600">
                  Template: {campaign.metadata.template?.title || 'No template'}
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className={`badge ${getStatusColor(campaign.metadata.status.key)}`}>
                  {campaign.metadata.status.value}
                </span>
                
                {campaign.metadata.send_date && (
                  <span className="text-sm text-gray-500">
                    {new Date(campaign.metadata.send_date).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}