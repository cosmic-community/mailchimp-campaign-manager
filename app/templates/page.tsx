import Link from 'next/link';
import { getEmailTemplates } from '@/lib/cosmic';
import TemplatesList from '@/components/TemplatesList';
import Navigation from '@/components/Navigation';

// Force dynamic rendering - no static generation
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function TemplatesPage() {
  const templates = await getEmailTemplates(50);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Email Templates
            </h1>
            <p className="text-gray-600">
              Create and manage reusable email templates
            </p>
          </div>
          
          <Link
            href="/templates/new"
            className="btn btn-primary"
          >
            Create Template
          </Link>
        </div>

        <TemplatesList templates={templates} />
      </main>
    </div>
  );
}