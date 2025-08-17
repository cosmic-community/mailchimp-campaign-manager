import { NextRequest, NextResponse } from 'next/server';
import { generateEmailTemplate } from '@/lib/cosmic';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const result = await generateEmailTemplate(prompt);

    return NextResponse.json({
      html_content: result.text,
      usage: result.usage
    });
  } catch (error) {
    console.error('Error generating template:', error);
    return NextResponse.json(
      { error: 'Failed to generate template' },
      { status: 500 }
    );
  }
}