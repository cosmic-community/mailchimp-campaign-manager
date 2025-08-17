import Navigation from '@/components/Navigation';
import TemplateForm from '@/components/TemplateForm';

export default function NewTemplatePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Email Template
          </h1>
          <p className="text-gray-600">
            Design professional email templates with AI assistance
          </p>
        </div>

        <TemplateForm />
      </main>
    </div>
  );
}