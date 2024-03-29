import authConfig from './auth.config';
import NextAuth from 'next-auth';

import {
  DEFAULT_LOGIN_REDIRECT,
  adminRoutes,
  apiPrefix,
  authRoutes,
  privateRoutes,
  publicRoutes,
} from '@/routes';
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;

  const isLoggedIn = !!req.auth;
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isPrivateRoute = privateRoutes.includes(nextUrl.pathname);
  const isAdminRoute = adminRoutes.includes(nextUrl.pathname);
  const isApiRoute = nextUrl.pathname.startsWith(apiPrefix);

  if (isApiRoute) {
    return null;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      // nextUrl creates an absolute url
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }

  if (!isLoggedIn && !isPublicRoute) {
    let callBackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callBackUrl += nextUrl.search;
    }
    const encodedUrl = encodeURIComponent(callBackUrl);

    return Response.redirect(
      new URL(`/auth/login?callbackUrl=${encodedUrl}`, nextUrl)
    );
  }

  // req.auth
  return null;
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
