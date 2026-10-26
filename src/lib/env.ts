/**
 * Production Environment Configuration & Validation Helper
 */

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  
  // Security
  ADMIN_SECURITY_PIN: process.env.ADMIN_SECURITY_PIN || '9922',
  AUTH_SECRET: process.env.AUTH_SECRET || 'bizzup_default_secret_key_32_characters_min',
  
  // Neon PostgreSQL
  DATABASE_URL: process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || '',
  HAS_DATABASE: Boolean(process.env.DATABASE_URL || process.env.NEON_DATABASE_URL),

  // Google Gemini AI
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '',
  GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
  HAS_GEMINI_KEY: Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY),

  // WhatsApp Cloud API
  WHATSAPP_TOKEN: process.env.WHATSAPP_TOKEN || '',
  WHATSAPP_PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
  WHATSAPP_VERIFY_TOKEN: process.env.WHATSAPP_VERIFY_TOKEN || 'bizzup_webhook_verification_token_2026',

  // IndiaMart CRM
  INDIAMART_CRM_KEY: process.env.INDIAMART_CRM_KEY || '',

  // Calling Provider
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || '',
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || '',
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER || '',

  // Razorpay Payment Gateway (Production & Sandbox)
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || '',
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || '',
  HAS_RAZORPAY: Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),

  // Fallback
  ENABLE_MOCK_FALLBACK: process.env.ENABLE_MOCK_FALLBACK !== 'false',
};

/**
 * Validates critical environment configuration at startup
 */
export function validateProductionEnv(): { valid: boolean; warnings: string[] } {
  const warnings: string[] = [];

  if (!env.HAS_DATABASE) {
    warnings.push('DATABASE_URL is not configured; running with resilient in-memory state.');
  }

  if (!env.HAS_GEMINI_KEY) {
    warnings.push('GEMINI_API_KEY is not configured; Gemini requests will use the rule-based heuristic agent engine.');
  }

  if (env.IS_PRODUCTION && env.ADMIN_SECURITY_PIN === '9922') {
    warnings.push('ADMIN_SECURITY_PIN is using default demo PIN. Change ADMIN_SECURITY_PIN in production.');
  }

  return {
    valid: true,
    warnings,
  };
}
