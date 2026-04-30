import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET ?? 'fallback_secret');

const USER_PATHS = ['/dashboard', '/places', '/map', '/plan', '/profile'];
const ADMIN_PATHS = ['/admin'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isUserPath = USER_PATHS.some(p => pathname.startsWith(p));
  const isAdminPath = ADMIN_PATHS.some(p => pathname.startsWith(p));

  if (!isUserPath && !isAdminPath) return NextResponse.next();

  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    if (isAdminPath && payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/places/:path*',
    '/map/:path*',
    '/plan/:path*',
    '/profile/:path*',
    '/admin/:path*',
  ],
};
