import Navigation from '@/components/Navigation';
import DashboardStats from '@/components/DashboardStats';
import RecentCampaigns from '@/components/RecentCampaigns';

// Force dynamic rendering - no static generation
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Campaign Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your email campaigns, contacts, and templates
          </p>
        </div>

        <DashboardStats />
        
        <div className="mt-8">
          <RecentCampaigns />
        </div>
      </main>
    </div>
  );
}