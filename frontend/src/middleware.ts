import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

interface JWTPayload {
  sub: string;
  role: string;
  exp: number;
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  // Protect /candidate routes
  if (request.nextUrl.pathname.startsWith('/candidate')) {
    if (!token) return NextResponse.redirect(new URL('/login', request.url));
    try {
      const decoded = jwtDecode<JWTPayload>(token);
      if (decoded.role !== 'CANDIDATE' && decoded.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Protect /assessor routes
  if (request.nextUrl.pathname.startsWith('/assessor')) {
    if (!token) return NextResponse.redirect(new URL('/login', request.url));
    try {
      const decoded = jwtDecode<JWTPayload>(token);
      if (decoded.role !== 'ASSESSOR' && decoded.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/candidate/:path*', '/assessor/:path*'],
};
