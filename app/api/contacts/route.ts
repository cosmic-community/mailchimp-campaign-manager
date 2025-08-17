import { NextRequest, NextResponse } from 'next/server';
import { createContact } from '@/lib/cosmic';
import type { ContactFormData } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();
    
    if (!body.email || !body.status) {
      return NextResponse.json(
        { error: 'Email and status are required' },
        { status: 400 }
      );
    }

    const contact = await createContact({
      email: body.email,
      first_name: body.first_name,
      last_name: body.last_name,
      status: body.status,
      tags: body.tags
    });

    return NextResponse.json(contact);
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json(
      { error: 'Failed to create contact' },
      { status: 500 }
    );
  }
}