import { NextRequest, NextResponse } from 'next/server';
import { createCampaign } from '@/lib/cosmic';
import type { CampaignFormData } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: CampaignFormData = await request.json();
    
    if (!body.name || !body.template_id || !body.status) {
      return NextResponse.json(
        { error: 'Name, template ID, and status are required' },
        { status: 400 }
      );
    }

    const campaign = await createCampaign({
      name: body.name,
      template_id: body.template_id,
      status: body.status,
      send_date: body.send_date,
      target_tags: body.target_tags,
      notes: body.notes
    });

    return NextResponse.json(campaign);
  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
}