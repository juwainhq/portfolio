import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE_NAME = "admin_session";

// Simple verification using HMAC (matching the server-side auth)
// Note: This uses a sync approach to avoid async issues in middleware
function verifyTokenSync(token: string | undefined): boolean {
  if (!token) return false;
  
  const sessionSecret = process.env.SESSION_SECRET || "fallback-dev-secret-change-in-production";
  
  try {
    const [encodedPayload, signature] = token.split(".");
    if (!encodedPayload || !signature) return false;
    
    // Decode payload
    const payload = Buffer.from(encodedPayload, "base64").toString();
    
    // Verify HMAC signature using Web Crypto API
    // Since middleware runs in Edge runtime, we need synchronous check
    // The signature was created with HMAC-SHA256
    // We use a Node.js compatible approach here
    const { createHmac } = require("crypto");
    const expectedSignature = createHmac("sha256", sessionSecret)
      .update(payload)
      .digest("base64");
    
    if (signature !== expectedSignature) return false;
    
    // Check expiration
    const [, expiresStr] = payload.split(":");
    const expiresAt = parseInt(expiresStr, 10);
    if (isNaN(expiresAt)) return false;
    
    return Date.now() < expiresAt;
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Protect /admin and /preview routes (except /admin/login)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    
    if (!verifyTokenSync(token)) {
      // Redirect to login page
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  if (pathname.startsWith("/preview")) {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    
    if (!verifyTokenSync(token)) {
      // Redirect to login page
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/preview"],
};
