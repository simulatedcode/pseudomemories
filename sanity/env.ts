export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-02-17'

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET. Ensure it is added to your environment variables (e.g., in .env.local or Vercel Project Settings).'
)

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)

export const token = process.env.SANITY_API_READ_TOKEN

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    if (typeof window === 'undefined') {
      // During server-side build, pre-rendering, or initial server-side execution,
      // don't crash if environment variables are missing.
      console.warn(`⚠️ Warning: ${errorMessage}. This is expected during build time if variables are not in .env.`);
      return 'build-time-placeholder' as unknown as T;
    }
    throw new Error(errorMessage)
  }

  return v
}
