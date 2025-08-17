import Link from 'next/link';
import { getContacts } from '@/lib/cosmic';
import ContactsList from '@/components/ContactsList';
import Navigation from '@/components/Navigation';

// Force dynamic rendering - no static generation
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ContactsPage() {
  const contacts = await getContacts(100);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Contact Management
            </h1>
            <p className="text-gray-600">
              Manage your email subscribers and their preferences
            </p>
          </div>
          
          <div className="flex gap-4">
            <Link
              href="/contacts/import"
              className="btn btn-secondary"
            >
              Import Contacts
            </Link>
            <Link
              href="/contacts/new"
              className="btn btn-primary"
            >
              Add Contact
            </Link>
          </div>
        </div>

        <ContactsList contacts={contacts} />
      </main>
    </div>
  );
}