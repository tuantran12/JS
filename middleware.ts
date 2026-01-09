import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Middleware disabled - configure domain redirects based on your setup
  // Example: Redirect root domain to subdomain
  // const host = request.headers.get('host') || '';
  // const url = request.nextUrl.clone();
  // if (host === 'yourdomain.com' || host === 'www.yourdomain.com') {
  //   url.host = 'app.yourdomain.com';
  //   return NextResponse.redirect(url, { status: 301 });
  // }

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
