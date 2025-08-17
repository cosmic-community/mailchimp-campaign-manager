import { createBucketClient } from '@cosmicjs/sdk'

if (!process.env.COSMIC_BUCKET_SLUG || !process.env.COSMIC_READ_KEY) {
  throw new Error('Missing Cosmic CMS environment variables')
}

// Create read-only client for client-side operations
export const cosmicReadOnly = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG,
  readKey: process.env.COSMIC_READ_KEY,
})

// Create full client with write permissions for server-side operations
export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG,
  readKey: process.env.COSMIC_READ_KEY,
  writeKey: process.env.COSMIC_WRITE_KEY,
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