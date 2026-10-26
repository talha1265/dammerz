import { NextResponse } from 'next/server';

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// In-memory sliding window rate limit cache
const rateLimitMap = new Map<string, RateLimitRecord>();

// Cleanup stale entries every 5 minutes to prevent memory leaks
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitMap.entries()) {
      if (now > value.resetAt) {
        rateLimitMap.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export interface RateLimitOptions {
  limit: number; // Maximum allowed requests
  windowMs: number; // Time window in milliseconds
}

/**
 * Checks and increments request count for a given identifier (e.g., client IP or API key)
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = { limit: 60, windowMs: 60000 }
): {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
} {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetAt) {
    // Window expired or new identifier
    rateLimitMap.set(identifier, {
      count: 1,
      resetAt: now + options.windowMs,
    });
    return {
      success: true,
      limit: options.limit,
      remaining: options.limit - 1,
      reset: Math.ceil(options.windowMs / 1000),
    };
  }

  // Increment counter within current window
  record.count += 1;

  if (record.count > options.limit) {
    return {
      success: false,
      limit: options.limit,
      remaining: 0,
      reset: Math.ceil((record.resetAt - now) / 1000),
    };
  }

  return {
    success: true,
    limit: options.limit,
    remaining: options.limit - record.count,
    reset: Math.ceil((record.resetAt - now) / 1000),
  };
}

/**
 * Extracts client IP address from incoming Next.js Request
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.headers.get('x-real-ip') || '127.0.0.1';
}

/**
 * Creates standard HTTP 429 Too Many Requests response
 */
export function createRateLimitResponse(resetSeconds: number) {
  return NextResponse.json(
    {
      error: 'Too Many Requests',
      message: `Rate limit exceeded. Please retry after ${resetSeconds} seconds.`,
      retryAfterSeconds: resetSeconds,
    },
    {
      status: 429,
      headers: {
        'Retry-After': String(resetSeconds),
        'X-RateLimit-Remaining': '0',
      },
    }
  );
}
