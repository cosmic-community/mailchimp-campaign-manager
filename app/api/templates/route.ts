import { NextRequest, NextResponse } from 'next/server';
import { createEmailTemplate } from '@/lib/cosmic';
import type { TemplateFormData } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: TemplateFormData = await request.json();
    
    if (!body.name || !body.subject || !body.html_content) {
      return NextResponse.json(
        { error: 'Name, subject, and HTML content are required' },
        { status: 400 }
      );
    }

    const template = await createEmailTemplate({
      name: body.name,
      subject: body.subject,
      html_content: body.html_content,
      category: body.category
    });

    return NextResponse.json(template);
  } catch (error) {
    console.error('Error creating template:', error);
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    );
  }
}