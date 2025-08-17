import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getCampaign, getContacts } from '@/lib/cosmic';

interface Contact {
  id: string;
  title: string;
  metadata: {
    email: string;
    status: string;
    tags?: string[];
  };
}

interface Campaign {
  id: string;
  title: string;
  metadata: {
    template?: {
      title: string;
      metadata?: {
        subject?: string;
        html_content?: string;
      };
    };
    target_tags?: string[];
    status: string;
    send_date?: string;
  };
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { campaign_id, test_email } = await request.json();
    
    if (!campaign_id) {
      return NextResponse.json(
        { error: 'Campaign ID is required' },
        { status: 400 }
      );
    }

    const campaign = await getCampaign(campaign_id) as Campaign | null;
    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    if (!campaign.metadata.template) {
      return NextResponse.json(
        { error: 'Campaign template not found' },
        { status: 400 }
      );
    }

    // If test email is provided, send only to test address
    if (test_email) {
      try {
        const { data, error } = await resend.emails.send({
          from: 'noreply@yourdomain.com',
          to: [test_email],
          subject: `[TEST] ${campaign.metadata.template.metadata?.subject || 'Email Campaign'}`,
          html: campaign.metadata.template.metadata?.html_content || '<p>No content available</p>',
        });

        if (error) {
          console.error('Resend error:', error);
          return NextResponse.json(
            { error: 'Failed to send test email' },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          sent_count: 1,
          failed_count: 0,
          message: 'Test email sent successfully'
        });
      } catch (error) {
        console.error('Error sending test email:', error);
        return NextResponse.json(
          { error: 'Failed to send test email' },
          { status: 500 }
        );
      }
    }

    // Get target contacts
    const allContacts = await getContacts(1000) as Contact[];
    let targetContacts: Contact[] = [];

    if (campaign.metadata.target_tags && campaign.metadata.target_tags.length > 0) {
      // Filter contacts by tags
      targetContacts = allContacts.filter((contact: Contact) => 
        contact.metadata.status === 'subscribed' &&
        contact.metadata.tags &&
        campaign.metadata.target_tags?.some((tag: string) => 
          contact.metadata.tags?.includes(tag)
        )
      );
    } else {
      // Send to all subscribed contacts
      targetContacts = allContacts.filter((contact: Contact) => 
        contact.metadata.status === 'subscribed'
      );
    }

    if (targetContacts.length === 0) {
      return NextResponse.json(
        { error: 'No target contacts found' },
        { status: 400 }
      );
    }

    // Send emails in batches
    const batchSize = 50;
    let sentCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < targetContacts.length; i += batchSize) {
      const batch = targetContacts.slice(i, i + batchSize);
      
      try {
        const emailPromises = batch.map(async (contact: Contact) => {
          try {
            const { data, error } = await resend.emails.send({
              from: 'noreply@yourdomain.com',
              to: [contact.metadata.email],
              subject: campaign.metadata.template?.metadata?.subject || 'Email Campaign',
              html: campaign.metadata.template?.metadata?.html_content || '<p>No content available</p>',
            });

            if (error) {
              failedCount++;
              errors.push(`Failed to send to ${contact.metadata.email}: ${error.message}`);
            } else {
              sentCount++;
            }
          } catch (error) {
            failedCount++;
            errors.push(`Failed to send to ${contact.metadata.email}: ${error}`);
          }
        });

        await Promise.all(emailPromises);
        
        // Add delay between batches to respect rate limits
        if (i + batchSize < targetContacts.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error('Batch sending error:', error);
      }
    }

    return NextResponse.json({
      success: true,
      sent_count: sentCount,
      failed_count: failedCount,
      errors: errors.slice(0, 10) // Return first 10 errors only
    });

  } catch (error) {
    console.error('Error sending campaign:', error);
    return NextResponse.json(
      { error: 'Failed to send campaign' },
      { status: 500 }
    );
  }
}