/**
 * Get the correct redirect URL for OAuth based on the current environment
 * Local: http://localhost:5173
 * Vercel: https://yourapp.vercel.app
 * Preview: https://*.vercel.app
 */
export function getAuthRedirectUrl(): string {
  // Use environment variable if set (takes precedence)
  const siteUrl = import.meta.env.VITE_SITE_URL;
  
  if (siteUrl) {
    return `${siteUrl}/auth/callback`;
  }

  // Fallback to window.location.origin if in browser
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/auth/callback`;
  }

  // Safe fallback (shouldn't reach this in practice)
  return 'http://localhost:5173/auth/callback';
}
