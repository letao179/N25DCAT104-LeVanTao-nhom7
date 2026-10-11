import { auth } from "@/auth";
import { NextResponse } from "next/server";

/**
 * Next.js Middleware for Route Protection
 *
 * Intercepts requests at the Edge before rendering.
 * Uses NextAuth v5 `auth(...)` wrapper which decrypts and validates
 * the JWT session token from incoming request cookies.
 */
export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isProtectedPath = nextUrl.pathname.startsWith("/dashboard");
  const isAuthPage = nextUrl.pathname === "/login";

  // 1. Intercept unauthenticated requests to protected pages
  if (isProtectedPath && !isLoggedIn) {
    const loginUrl = new URL("/login", nextUrl.origin);
    // Preserve the intended destination in `callbackUrl` query parameter
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Redirect logged-in users away from the login page to dashboard
  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - NextAuth API routes (/api/auth/*)
     * - Next.js internal static assets (_next/static, _next/image)
     * - Static asset files (favicon.ico, svg, png, etc.)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
