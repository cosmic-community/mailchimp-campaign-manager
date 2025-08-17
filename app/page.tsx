import Link from 'next/link';
import { getDashboardStats, getCampaigns } from '@/lib/cosmic';
import DashboardStats from '@/components/DashboardStats';
import RecentCampaigns from '@/components/RecentCampaigns';
import Navigation from '@/components/Navigation';

export default async function Dashboard() {
  const [stats, recentCampaigns] = await Promise.all([
    getDashboardStats(),
    getCampaigns(5)
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Email Campaign Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your email marketing campaigns, templates, and contacts
          </p>
        </div>

        <DashboardStats stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Link
                href="/contacts/new"
                className="block w-full btn btn-primary text-center"
              >
                Add New Contact
              </Link>
              <Link
                href="/templates/new"
                className="block w-full btn btn-secondary text-center"
              >
                Create Email Template
              </Link>
              <Link
                href="/campaigns/new"
                className="block w-full btn btn-success text-center"
              >
                Launch New Campaign
              </Link>
            </div>
          </div>

          <RecentCampaigns campaigns={recentCampaigns} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/contacts"
            className="card hover:shadow-lg transition-shadow duration-200 cursor-pointer"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">👥</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Manage Contacts
                </h3>
                <p className="text-gray-500 text-sm">
                  Import and organize subscribers
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/templates"
            className="card hover:shadow-lg transition-shadow duration-200 cursor-pointer"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">📧</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Email Templates
                </h3>
                <p className="text-gray-500 text-sm">
                  Create AI-powered templates
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/campaigns"
            className="card hover:shadow-lg transition-shadow duration-200 cursor-pointer"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-info rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">📮</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Campaigns
                </h3>
                <p className="text-gray-500 text-sm">
                  Launch email campaigns
                </p>
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}