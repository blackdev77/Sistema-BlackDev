import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const { auth } = NextAuth(authConfig);

const PORTAL_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || 'super-secret-fallback-key'
);

export default auth(async (req) => {
  const { nextUrl } = req;
  const isPortal = nextUrl.pathname.startsWith('/portal');
  const isPortalLogin = nextUrl.pathname === '/portal/login';

  if (isPortal) {
    const portalCookie = req.cookies.get('portal_session');
    
    if (!portalCookie?.value) {
      if (!isPortalLogin) {
        return NextResponse.redirect(new URL('/portal/login', nextUrl));
      }
      return NextResponse.next();
    }

    try {
      // Validate Edge-compatible JWT
      await jwtVerify(portalCookie.value, PORTAL_SECRET);
      
      if (isPortalLogin) {
        return NextResponse.redirect(new URL('/portal', nextUrl));
      }
      return NextResponse.next();
    } catch (err) {
      if (!isPortalLogin) {
        const response = NextResponse.redirect(new URL('/portal/login', nextUrl));
        response.cookies.delete('portal_session');
        return response;
      }
      return NextResponse.next();
    }
  }

  // Enforce Dashboard security (non-portal routes)
  const isLoggedIn = !!req.auth?.user;
  const isOnLogin = nextUrl.pathname.startsWith('/login');

  if (isOnLogin) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/', nextUrl));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/login', nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
