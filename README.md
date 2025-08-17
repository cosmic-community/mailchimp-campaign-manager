# Mailchimp Campaign Manager

![App Preview](https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=300&fit=crop&auto=format)

A comprehensive email marketing management platform that enables you to manage contacts, create AI-powered email templates, and launch targeted campaigns. Built with Next.js, Cosmic CMS, and Resend for professional email marketing automation.

## Features

- 📧 **Contact Management** - Import, organize, and segment email subscribers
- 🤖 **AI Template Generation** - Create professional HTML email templates using Cosmic AI
- 📮 **Campaign Builder** - Design and schedule email campaigns with audience targeting
- 📊 **Dashboard Analytics** - Monitor campaign performance and contact statistics
- 🎯 **Tag-based Targeting** - Segment contacts with flexible tagging system
- 📱 **Responsive Design** - Full mobile and desktop compatibility
- 🚀 **Email Delivery** - Reliable email sending via Resend API

## Clone this Bucket and Code Repository

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Bucket and Code Repository](https://img.shields.io/badge/Clone%20this%20Bucket-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](https://app.cosmic-staging.com/projects/new?clone_bucket=68a15552f45d4ab57d5fbcfb&clone_repository=68a1584db858141f9791a215)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> "Create a mailchimp app. Functionality includes: 1) Import contacts 2) Create HTML templates 3) Create campaigns with email templates"

### Code Generation Prompt

> Create a mailchimp app. Functionality includes: 1) Import contacts 2) Create HTML templates 3) Create campaigns with email templates. Use Cosmic AI for generating email templates. Send email using Resend

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## Technologies

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **CMS**: Cosmic Headless CMS
- **Email Service**: Resend API
- **AI Generation**: Cosmic AI
- **Language**: TypeScript
- **Deployment**: Vercel Ready

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Cosmic account with your bucket credentials
- Resend account with API key

### Installation

1. Clone this repository
2. Install dependencies:

```bash
bun install
```

3. Set up environment variables in your deployment platform:

- `COSMIC_BUCKET_SLUG` - Your Cosmic bucket slug
- `COSMIC_READ_KEY` - Your Cosmic read key  
- `COSMIC_WRITE_KEY` - Your Cosmic write key
- `RESEND_API_KEY` - Your Resend API key

4. Run the development server:

```bash
bun dev
```

## Cosmic SDK Examples

### Fetching Contacts

```typescript
const contacts = await cosmic.objects
  .find({ type: 'contacts' })
  .props(['id', 'title', 'metadata'])
  .limit(50)
```

### Creating Email Templates with AI

```typescript
const aiResponse = await cosmic.ai.generateText({
  prompt: 'Create a professional newsletter template with company updates section',
  max_tokens: 1000
})

await cosmic.objects.insertOne({
  type: 'email-templates',
  title: templateName,
  metadata: {
    name: templateName,
    subject: subject,
    html_content: aiResponse.text,
    category: 'newsletter'
  }
})
```

### Managing Campaigns

```typescript
await cosmic.objects.insertOne({
  type: 'campaigns',
  title: campaignName,
  metadata: {
    name: campaignName,
    template: templateId,
    status: 'draft',
    target_tags: ['Newsletter', 'VIP']
  }
})
```

## Cosmic CMS Integration

This application uses three main Cosmic object types:

- **Contacts** - Store subscriber information with email validation and tagging
- **Email Templates** - Manage HTML email templates with AI generation capabilities
- **Campaigns** - Track email campaigns with template relationships and targeting

All content is managed through Cosmic's API with real-time updates and seamless relationships between templates and campaigns.

## Deployment Options

### Vercel (Recommended)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Netlify  
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

Remember to set your environment variables in your deployment platform's dashboard.

<!-- README_END -->