import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const host = request.headers.get('host') || '';
    const url = request.nextUrl.clone();

  // Redirect root domain senkai.xyz to app.senkai.xyz
  if (host === 'senkai.xyz' || host === 'www.senkai.xyz') {
        url.host = 'app.senkai.xyz';
        return NextResponse.redirect(url, { status: 301 });
  }

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
