export interface CosmicObject {
  id: string;
  title: string;
  slug: string;
  created_at: string;
  modified_at: string;
  status: string;
  metadata: Record<string, any>;
}

export interface Campaign extends CosmicObject {
  metadata: {
    status: 'draft' | 'scheduled' | 'sent' | 'paused';
    template?: EmailTemplate;
    target_tags?: string[];
    send_date?: string;
    subject?: string;
    description?: string;
    notes?: string;
  };
}

export interface Contact extends CosmicObject {
  metadata: {
    email: string;
    first_name?: string;
    last_name?: string;
    status: 'subscribed' | 'unsubscribed' | 'pending';
    tags?: string[];
    source?: string;
    subscribed_at?: string;
  };
}

export interface EmailTemplate extends CosmicObject {
  metadata: {
    subject: string;
    html_content: string;
    text_content?: string;
    preview_text?: string;
    category?: string;
    is_active?: boolean;
    preview_image?: {
      imgix_url: string;
    };
  };
}

export interface DashboardStats {
  totalCampaigns: number;
  totalContacts: number;
  subscribedContacts: number;
  totalTemplates: number;
  sentCampaigns: number;
  total_campaigns: number;
  total_contacts: number;
  subscribed_contacts: number;
  total_templates: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface SendCampaignRequest {
  campaign_id: string;
  test_email?: string;
}

export interface SendCampaignResponse {
  success: boolean;
  sent_count: number;
  failed_count: number;
  errors?: string[];
  message?: string;
}

// Form data types
export interface CampaignFormData {
  name: string;
  template_id: string;
  status: CampaignStatus;
  send_date?: string;
  target_tags?: string[];
  notes?: string;
}

export interface ContactFormData {
  email: string;
  first_name?: string;
  last_name?: string;
  status: ContactStatus;
  tags?: string[];
}

export interface TemplateFormData {
  name: string;
  subject: string;
  html_content: string;
  category?: TemplateCategory;
}

// Status and category types
export type CampaignStatus = 'draft' | 'scheduled' | 'sent' | 'paused';
export type ContactStatus = 'subscribed' | 'unsubscribed' | 'pending';
export type TemplateCategory = 'newsletter' | 'promotional' | 'transactional' | 'announcement';