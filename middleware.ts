import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from "next/headers";

export async function middleware(request: NextRequest) {
  const session = (await cookies()).get('appwrite-session');
  const signInPath = '/sign-in';
  if (!session && !request.nextUrl.pathname.startsWith(signInPath)) {
    const signInUrl = new URL(signInPath, request.url);
    return NextResponse.redirect(signInUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|favicon.ico|static|api|sign-up).*)',
  ],
};
