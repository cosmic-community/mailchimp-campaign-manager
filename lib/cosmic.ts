import { createBucketClient } from '@cosmicjs/sdk';
import type { Contact, EmailTemplate, Campaign, CosmicResponse, ContactStatus, CampaignStatus, TemplateCategory } from '@/types';

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
  apiEnvironment: 'staging'
});

// Simple error helper for Cosmic SDK
function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

// Contact functions
export async function getContacts(limit = 50): Promise<Contact[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'contacts' })
      .props(['id', 'title', 'slug', 'metadata'])
      .limit(limit);
    return response.objects as Contact[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch contacts');
  }
}

export async function getContactsByStatus(status: ContactStatus): Promise<Contact[]> {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'contacts',
        'metadata.status.key': status
      })
      .props(['id', 'title', 'slug', 'metadata']);
    return response.objects as Contact[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch contacts by status');
  }
}

export async function createContact(contactData: {
  email: string;
  first_name?: string;
  last_name?: string;
  status: ContactStatus;
  tags?: string[];
}): Promise<Contact> {
  try {
    const response = await cosmic.objects.insertOne({
      type: 'contacts',
      title: contactData.email,
      metadata: {
        email: contactData.email,
        first_name: contactData.first_name || '',
        last_name: contactData.last_name || '',
        status: contactData.status,
        tags: contactData.tags || []
      }
    });
    return response.object as Contact;
  } catch (error) {
    console.error('Error creating contact:', error);
    throw new Error('Failed to create contact');
  }
}

export async function updateContact(contactId: string, updates: Partial<Contact['metadata']>): Promise<Contact> {
  try {
    const response = await cosmic.objects.updateOne(contactId, {
      metadata: updates
    });
    return response.object as Contact;
  } catch (error) {
    console.error('Error updating contact:', error);
    throw new Error('Failed to update contact');
  }
}

export async function deleteContact(contactId: string): Promise<void> {
  try {
    await cosmic.objects.deleteOne(contactId);
  } catch (error) {
    console.error('Error deleting contact:', error);
    throw new Error('Failed to delete contact');
  }
}

// Email template functions
export async function getEmailTemplates(limit = 50): Promise<EmailTemplate[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'email-templates' })
      .props(['id', 'title', 'slug', 'metadata'])
      .limit(limit);
    return response.objects as EmailTemplate[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch email templates');
  }
}

export async function getEmailTemplate(slug: string): Promise<EmailTemplate | null> {
  try {
    const response = await cosmic.objects.findOne({
      type: 'email-templates',
      slug
    }).props(['id', 'title', 'slug', 'metadata']);
    
    if (!response.object) {
      return null;
    }
    
    return response.object as EmailTemplate;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch email template');
  }
}

export async function createEmailTemplate(templateData: {
  name: string;
  subject: string;
  html_content: string;
  category?: TemplateCategory;
}): Promise<EmailTemplate> {
  try {
    const response = await cosmic.objects.insertOne({
      type: 'email-templates',
      title: templateData.name,
      metadata: {
        name: templateData.name,
        subject: templateData.subject,
        html_content: templateData.html_content,
        category: templateData.category || 'newsletter'
      }
    });
    return response.object as EmailTemplate;
  } catch (error) {
    console.error('Error creating email template:', error);
    throw new Error('Failed to create email template');
  }
}

export async function updateEmailTemplate(templateId: string, updates: Partial<EmailTemplate['metadata']>): Promise<EmailTemplate> {
  try {
    const response = await cosmic.objects.updateOne(templateId, {
      metadata: updates
    });
    return response.object as EmailTemplate;
  } catch (error) {
    console.error('Error updating email template:', error);
    throw new Error('Failed to update email template');
  }
}

export async function deleteEmailTemplate(templateId: string): Promise<void> {
  try {
    await cosmic.objects.deleteOne(templateId);
  } catch (error) {
    console.error('Error deleting email template:', error);
    throw new Error('Failed to delete email template');
  }
}

// Campaign functions
export async function getCampaigns(limit = 50): Promise<Campaign[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'campaigns' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
      .limit(limit);
    return response.objects as Campaign[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch campaigns');
  }
}

export async function getCampaign(slug: string): Promise<Campaign | null> {
  try {
    const response = await cosmic.objects.findOne({
      type: 'campaigns',
      slug
    }).props(['id', 'title', 'slug', 'metadata']).depth(1);
    
    if (!response.object) {
      return null;
    }
    
    return response.object as Campaign;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch campaign');
  }
}

export async function createCampaign(campaignData: {
  name: string;
  template_id: string;
  status: CampaignStatus;
  send_date?: string;
  target_tags?: string[];
  notes?: string;
}): Promise<Campaign> {
  try {
    const response = await cosmic.objects.insertOne({
      type: 'campaigns',
      title: campaignData.name,
      metadata: {
        name: campaignData.name,
        template: campaignData.template_id,
        status: campaignData.status,
        send_date: campaignData.send_date || '',
        target_tags: campaignData.target_tags || [],
        notes: campaignData.notes || ''
      }
    });
    return response.object as Campaign;
  } catch (error) {
    console.error('Error creating campaign:', error);
    throw new Error('Failed to create campaign');
  }
}

export async function updateCampaign(campaignId: string, updates: Partial<Campaign['metadata']>): Promise<Campaign> {
  try {
    const response = await cosmic.objects.updateOne(campaignId, {
      metadata: updates
    });
    return response.object as Campaign;
  } catch (error) {
    console.error('Error updating campaign:', error);
    throw new Error('Failed to update campaign');
  }
}

export async function deleteCampaign(campaignId: string): Promise<void> {
  try {
    await cosmic.objects.deleteOne(campaignId);
  } catch (error) {
    console.error('Error deleting campaign:', error);
    throw new Error('Failed to delete campaign');
  }
}

// AI functions
export async function generateEmailTemplate(prompt: string): Promise<{ text: string; usage: any }> {
  try {
    const response = await cosmic.ai.generateText({
      prompt: `Create a professional HTML email template based on this description: ${prompt}. 
      
      Include proper HTML structure with inline CSS styles for email compatibility. Use professional styling with:
      - Maximum width of 600px
      - Proper font families (Arial, sans-serif)
      - Responsive design principles
      - Clear call-to-action sections
      - Proper header, content, and footer sections
      
      Return only the HTML content without any explanations.`,
      max_tokens: 2000
    });
    
    return response;
  } catch (error) {
    console.error('Error generating email template:', error);
    throw new Error('Failed to generate email template');
  }
}

// Statistics functions
export async function getDashboardStats(): Promise<{
  total_contacts: number;
  subscribed_contacts: number;
  total_templates: number;
  total_campaigns: number;
}> {
  try {
    const [contacts, subscribedContacts, templates, campaigns] = await Promise.all([
      getContacts(1000),
      getContactsByStatus('subscribed'),
      getEmailTemplates(1000),
      getCampaigns(1000)
    ]);

    return {
      total_contacts: contacts.length,
      subscribed_contacts: subscribedContacts.length,
      total_templates: templates.length,
      total_campaigns: campaigns.length
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      total_contacts: 0,
      subscribed_contacts: 0,
      total_templates: 0,
      total_campaigns: 0
    };
  }
}