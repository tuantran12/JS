import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Middleware for future use (e.g., authentication, redirects)
  // Currently passes through all requests
  return NextResponse.next();
}

export const config = {
    matcher: [
          /*
           * Match all request paths except for the ones starting with:
           * - api (API routes)
           * - _next/static (static files)
           * - _next/image (image optimization files)
           * - favicon.ico (favicon file)
           */
      '/((?!api|_next/static|_next/image|favicon.ico).*)',
        ],
};
