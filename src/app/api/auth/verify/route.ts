import { NextResponse } from "next/server";
import { getSessionToken, verifySessionToken } from "@/lib/auth";

export async function GET() {
  const token = await getSessionToken();
  
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const isValid = await verifySessionToken(token);
  
  if (!isValid) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true });
}
