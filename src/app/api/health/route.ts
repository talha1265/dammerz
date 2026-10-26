import { NextResponse } from 'next/server';
import { env, validateProductionEnv } from '@/lib/env';

export async function GET() {
  const validation = validateProductionEnv();
  
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: env.NODE_ENV,
    neonDatabase: env.HAS_DATABASE ? 'configured' : 'in-memory-fallback',
    geminiAI: {
      model: env.GEMINI_MODEL,
      keyConfigured: env.HAS_GEMINI_KEY,
    },
    metaWhatsAppWebhook: {
      verifyTokenConfigured: Boolean(env.WHATSAPP_VERIFY_TOKEN),
    },
    systemWarnings: validation.warnings,
  });
}
