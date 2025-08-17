import { getEmailTemplates } from '@/lib/cosmic';
import Navigation from '@/components/Navigation';
import CampaignForm from '@/components/CampaignForm';

export default async function NewCampaignPage() {
  const templates = await getEmailTemplates(100);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Email Campaign
          </h1>
          <p className="text-gray-600">
            Set up a new email campaign with targeting and scheduling
          </p>
        </div>

        <div className="card">
          <CampaignForm templates={templates} />
        </div>
      </main>
    </div>
  );
}