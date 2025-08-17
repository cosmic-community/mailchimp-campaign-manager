// Base Cosmic object interface
interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, any>;
  type: string;
  created_at: string;
  modified_at: string;
}

// Contact object type
interface Contact extends CosmicObject {
  type: 'contacts';
  metadata: {
    email: string;
    first_name?: string;
    last_name?: string;
    status: {
      key: ContactStatus;
      value: string;
    };
    tags?: string[];
  };
}

// Email template object type
interface EmailTemplate extends CosmicObject {
  type: 'email-templates';
  metadata: {
    name: string;
    subject: string;
    html_content: string;
    preview_image?: {
      url: string;
      imgix_url: string;
    };
    category?: {
      key: TemplateCategory;
      value: string;
    };
  };
}

// Campaign object type
interface Campaign extends CosmicObject {
  type: 'campaigns';
  metadata: {
    name: string;
    template?: EmailTemplate;
    status: {
      key: CampaignStatus;
      value: string;
    };
    send_date?: string;
    target_tags?: string[];
    notes?: string;
  };
}

// Type literals for select-dropdown values
type ContactStatus = 'subscribed' | 'unsubscribed' | 'pending';
type TemplateCategory = 'newsletter' | 'promotional' | 'transactional' | 'announcement';
type CampaignStatus = 'draft' | 'scheduled' | 'sent' | 'paused';

// API response types
interface CosmicResponse<T> {
  objects: T[];
  total: number;
  limit?: number;
  skip?: number;
}

// Form data types
interface ContactFormData {
  email: string;
  first_name?: string;
  last_name?: string;
  status: ContactStatus;
  tags?: string[];
}

interface TemplateFormData {
  name: string;
  subject: string;
  html_content: string;
  category?: TemplateCategory;
  preview_image?: File;
}

interface CampaignFormData {
  name: string;
  template_id: string;
  status: CampaignStatus;
  send_date?: string;
  target_tags?: string[];
  notes?: string;
}

// AI generation types
interface AITemplateRequest {
  prompt: string;
  template_type: TemplateCategory;
  subject_line?: string;
}

// Email sending types
interface EmailSendRequest {
  campaign_id: string;
  test_email?: string;
}

interface EmailSendResponse {
  success: boolean;
  sent_count: number;
  failed_count: number;
  errors?: string[];
}

// Statistics types
interface DashboardStats {
  total_contacts: number;
  subscribed_contacts: number;
  total_templates: number;
  total_campaigns: number;
  recent_campaigns: Campaign[];
}

// Type guards
function isContact(obj: CosmicObject): obj is Contact {
  return obj.type === 'contacts';
}

function isEmailTemplate(obj: CosmicObject): obj is EmailTemplate {
  return obj.type === 'email-templates';
}

function isCampaign(obj: CosmicObject): obj is Campaign {
  return obj.type === 'campaigns';
}

// Utility types
type CreateContactData = Omit<Contact, 'id' | 'created_at' | 'modified_at' | 'slug'>;
type CreateTemplateData = Omit<EmailTemplate, 'id' | 'created_at' | 'modified_at' | 'slug'>;
type CreateCampaignData = Omit<Campaign, 'id' | 'created_at' | 'modified_at' | 'slug'>;

export type {
  CosmicObject,
  Contact,
  EmailTemplate,
  Campaign,
  ContactStatus,
  TemplateCategory,
  CampaignStatus,
  CosmicResponse,
  ContactFormData,
  TemplateFormData,
  CampaignFormData,
  AITemplateRequest,
  EmailSendRequest,
  EmailSendResponse,
  DashboardStats,
  CreateContactData,
  CreateTemplateData,
  CreateCampaignData,
};

export {
  isContact,
  isEmailTemplate,
  isCampaign,
};