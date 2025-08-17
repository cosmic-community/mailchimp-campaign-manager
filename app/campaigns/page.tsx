import Link from 'next/link';
import { getCampaigns } from '@/lib/cosmic';
import CampaignsList from '@/components/CampaignsList';
import Navigation from '@/components/Navigation';

export default async function CampaignsPage() {
  const campaigns = await getCampaigns(50);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Email Campaigns
            </h1>
            <p className="text-gray-600">
              Manage and launch your email marketing campaigns
            </p>
          </div>
          
          <Link
            href="/campaigns/new"
            className="btn btn-primary"
          >
            Create Campaign
          </Link>
        </div>

        <CampaignsList campaigns={campaigns} />
      </main>
    </div>
  );
}