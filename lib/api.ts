import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const API_SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET",
  "Access-Control-Allow-Headers": "Content-Type",
};

/**
 * Return a JSON response with security headers.
 */
export const jsonResponse = (body: unknown, status = 200) => {
  return NextResponse.json(body, { status, headers: API_SECURITY_HEADERS });
};

/**
 * Return a JSON error response with security headers.
 */
export const jsonError = (message: string, status = 400) => {
  return NextResponse.json({ error: message }, { status, headers: API_SECURITY_HEADERS });
};

/**
 * Return a 429 Too Many Requests response.
 */
export const jsonRateLimited = (retryAfter: number) => {
  return NextResponse.json(
    { error: "Too many requests" },
    {
      status: 429,
      headers: {
        ...API_SECURITY_HEADERS,
        "Retry-After": String(retryAfter),
      },
    }
  );
};

/**
 * Extract client IP from request headers.
 */
export const getClientIp = (request: NextRequest): string => {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
};

/**
 * Escape ILIKE special characters to prevent pattern injection.
 */
export const escapeIlike = (value: string): string => {
  return value.replace(/[%_\\]/g, "\\$&");
};
