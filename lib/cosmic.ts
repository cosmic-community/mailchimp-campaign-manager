import { createBucketClient } from '@cosmicjs/sdk'

if (!process.env.COSMIC_BUCKET_SLUG || !process.env.COSMIC_READ_KEY) {
  throw new Error('Missing Cosmic CMS environment variables')
}

// Create read-only client for client-side operations
export const cosmicReadOnly = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG,
  readKey: process.env.COSMIC_READ_KEY,
  apiEnvironment: "staging"
})

// Create full client with write permissions for server-side operations
export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG,
  readKey: process.env.COSMIC_READ_KEY,
  writeKey: process.env.COSMIC_WRITE_KEY,
  apiEnvironment: "staging"
})

// Helper function to handle Cosmic API errors
export function handleCosmicError(error: any): string {
  if (error?.status === 404) {
    return 'Content not found'
  }
  if (error?.message) {
    return error.message
  }
  return 'An unexpected error occurred'
}

// Helper function to safely get objects with error handling
export async function safeGetObjects(type: string, props?: string[], depth: number = 1) {
  try {
    const { objects } = await cosmicReadOnly.objects
      .find({ type })
      .props(props || ['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(depth)
    return { objects, error: null }
  } catch (error) {
    console.error(`Error fetching ${type}:`, error)
    return { objects: [], error: handleCosmicError(error) }
  }
}

// Helper function to safely get a single object
export async function safeGetObject(type: string, slug: string, props?: string[], depth: number = 1) {
  try {
    const { object } = await cosmicReadOnly.objects
      .findOne({ type, slug })
      .props(props || ['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(depth)
    return { object, error: null }
  } catch (error) {
    console.error(`Error fetching ${type} with slug ${slug}:`, error)
    return { object: null, error: handleCosmicError(error) }
  }
}

// Campaigns
export async function getCampaigns(limit?: number) {
  try {
    const { objects } = await cosmicReadOnly.objects
      .find({ type: 'campaigns' })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1)
      .limit(limit || 100)
    return objects || []
  } catch (error) {
    console.error('Error fetching campaigns:', error)
    return []
  }
}

export async function getCampaign(id: string) {
  try {
    const { object } = await cosmicReadOnly.objects
      .findOne({ type: 'campaigns', id })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1)
    return object
  } catch (error) {
    console.error(`Error fetching campaign ${id}:`, error)
    return null
  }
}

export async function createCampaign(data: any) {
  try {
    const { object } = await cosmic.objects.insertOne({
      title: data.title,
      type: 'campaigns',
      metadata: data.metadata
    })
    return object
  } catch (error) {
    console.error('Error creating campaign:', error)
    throw error
  }
}

// Contacts
export async function getContacts(limit?: number) {
  try {
    const { objects } = await cosmicReadOnly.objects
      .find({ type: 'contacts' })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1)
      .limit(limit || 1000)
    return objects || []
  } catch (error) {
    console.error('Error fetching contacts:', error)
    return []
  }
}

export async function createContact(data: any) {
  try {
    const { object } = await cosmic.objects.insertOne({
      title: data.title || data.email,
      type: 'contacts',
      metadata: data.metadata
    })
    return object
  } catch (error) {
    console.error('Error creating contact:', error)
    throw error
  }
}

// Email Templates
export async function getEmailTemplates(limit?: number) {
  try {
    const { objects } = await cosmicReadOnly.objects
      .find({ type: 'email-templates' })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1)
      .limit(limit || 100)
    return objects || []
  } catch (error) {
    console.error('Error fetching email templates:', error)
    return []
  }
}

export async function createEmailTemplate(data: any) {
  try {
    const { object } = await cosmic.objects.insertOne({
      title: data.title,
      type: 'email-templates',
      metadata: data.metadata
    })
    return object
  } catch (error) {
    console.error('Error creating email template:', error)
    throw error
  }
}

export async function generateEmailTemplate(prompt: string) {
  // This would integrate with an AI service like OpenAI
  // For now, return a basic template
  return {
    html_content: `<h1>Generated Email</h1><p>Content based on: ${prompt}</p>`,
    usage: 'Generated with AI template system'
  }
}

// Dashboard Stats
export async function getDashboardStats() {
  try {
    const [campaigns, contacts, templates] = await Promise.all([
      getCampaigns(),
      getContacts(),
      getEmailTemplates()
    ])

    const subscribedContacts = contacts.filter((contact: any) => 
      contact.metadata?.status === 'subscribed'
    )

    const sentCampaigns = campaigns.filter((campaign: any) => 
      campaign.metadata?.status === 'sent'
    )

    return {
      totalCampaigns: campaigns.length,
      totalContacts: contacts.length,
      subscribedContacts: subscribedContacts.length,
      totalTemplates: templates.length,
      sentCampaigns: sentCampaigns.length,
      total_campaigns: campaigns.length,
      total_contacts: contacts.length,
      subscribed_contacts: subscribedContacts.length,
      total_templates: templates.length
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return {
      totalCampaigns: 0,
      totalContacts: 0,
      subscribedContacts: 0,
      totalTemplates: 0,
      sentCampaigns: 0,
      total_campaigns: 0,
      total_contacts: 0,
      subscribed_contacts: 0,
      total_templates: 0
    }
  }
}