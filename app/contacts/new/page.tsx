import Navigation from '@/components/Navigation';
import ContactForm from '@/components/ContactForm';

export default function NewContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Add New Contact
          </h1>
          <p className="text-gray-600">
            Add a new subscriber to your email list
          </p>
        </div>

        <div className="card">
          <ContactForm />
        </div>
      </main>
    </div>
  );
}