export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-02-17'

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET. Ensure it is added to your environment variables (e.g., in .env.local or Vercel Project Settings).'
)

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID. Ensure it is added to your environment variables (e.g., in .env.local or Vercel Project Settings).'
)

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    if (process.env.NODE_ENV === 'production' && process.env.VERCEL) {
      // During Vercel build, don't crash the entire build process if variables are missing.
      // Pre-rendering often triggers these checks.
      console.warn(`⚠️ Warning: ${errorMessage}. This might cause issues if not fixed in Vercel Project Settings.`);
      return 'BUILD_TIME_PLACEHOLDER' as unknown as T;
    }
    throw new Error(errorMessage)
  }

  return v
}
