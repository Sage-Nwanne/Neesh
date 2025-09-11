// Application configuration

export const config = {
  // API Configuration - Always use Supabase Edge Functions for consistency
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://smfzrubkyxejzkblrrjr.supabase.co/functions/v1',
    timeout: 10000,
  },

  // Supabase Configuration
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  },

  // Stripe Configuration
  stripe: {
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
  },

  // Application Settings
  app: {
    name: 'NEESH',
    description: 'Magazine Marketplace',
    version: '1.0.0',
  },

  // Feature Flags
  features: {
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    enableNotifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true',
    enablePayments: import.meta.env.VITE_ENABLE_PAYMENTS === 'true',
  },

  // UI Configuration
  ui: {
    defaultPageSize: 20,
    maxFileUploadSize: 10 * 1024 * 1024, // 10MB
    supportedImageFormats: ['jpg', 'jpeg', 'png', 'webp'],
    supportedDocumentFormats: ['pdf', 'doc', 'docx'],
  },
} as const;

// Environment validation
const requiredEnvVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
] as const;

export function validateEnvironment(): void {
  const missing = requiredEnvVars.filter(
    (envVar) => !import.meta.env[envVar]
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}

// Initialize configuration
validateEnvironment();
