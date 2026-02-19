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

export const readToken = process.env.SANITY_API_READ_TOKEN
export const revalidateSecret = process.env.SANITY_REVALIDATE_SECRET

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (!v || v === 'build-time-placeholder') {
    // Check if we're in a browser environment to avoid spamming server logs
    // but still provide clear feedback where it's most needed.
    const isBrowser = typeof window !== 'undefined';

    const fullError = `❌ Missing Environment Variable: ${errorMessage}\n` +
      `Please ensure it is set in your .env.local or deployment environment settings.`;

    if (isBrowser) {
      console.error(fullError);
      return 'build-time-placeholder' as unknown as T;
    }

    throw new Error(fullError);
  }

  return v
}
