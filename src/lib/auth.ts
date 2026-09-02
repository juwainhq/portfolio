import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "admin_session";
const SESSION_SECRET = process.env.SESSION_SECRET || "fallback-dev-secret-change-in-production";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@portfolio.local";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";

// Simple HMAC-based token signing for session cookies
async function createHmacSignature(payload: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

async function verifyHmacSignature(payload: string, signature: string): Promise<boolean> {
  const expectedSignature = await createHmacSignature(payload);
  return signature === expectedSignature;
}

export async function createSessionToken(): Promise<string> {
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  const payload = `admin:${expiresAt}`;
  const signature = await createHmacSignature(payload);
  return `${Buffer.from(payload).toString("base64")}.${signature}`;
}

export async function verifySessionToken(token: string): Promise<boolean> {
  try {
    const [encodedPayload, signature] = token.split(".");
    if (!encodedPayload || !signature) return false;

    const payload = Buffer.from(encodedPayload, "base64").toString();
    const isValid = await verifyHmacSignature(payload, signature);
    if (!isValid) return false;

    // Check expiration
    const [, expiresStr] = payload.split(":");
    const expiresAt = parseInt(expiresStr, 10);
    return Date.now() < expiresAt;
  } catch {
    return false;
  }
}

export function validateCredentials(email: string, password: string): boolean {
  // Server-side credential check using environment variables
  // Never expose these in client-side code
  return email === ADMIN_EMAIL && password === ADMIN_PASSWORD;
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });
}

export async function getSessionToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value;
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
