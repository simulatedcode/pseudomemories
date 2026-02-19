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
    // Use a more prominent error message for production troubleshooting
    console.error(
      `🔴 Sanity Configuration Error: ${errorMessage}\n\n` +
      `To fix this, please follow these steps:\n` +
      `1. Go to your project settings in Sanity.io and get your Project ID.\n` +
      `2. Go to your Vercel Dashboard -> Project Settings -> Environment Variables.\n` +
      `3. Add 'NEXT_PUBLIC_SANITY_PROJECT_ID' and 'NEXT_PUBLIC_SANITY_DATASET'.\n` +
      `4. Trigger a new deployment on Vercel.\n`
    );
    return 'build-time-placeholder' as unknown as T;
  }

  return v
}
