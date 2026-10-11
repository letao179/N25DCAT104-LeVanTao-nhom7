import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

/**
 * NextAuth.js (v5 / Auth.js) Configuration
 *
 * Implements stateless JWT authentication with GitHub OAuth provider,
 * custom JWT & Session callbacks, and strict TypeScript types.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
  session: {
    // Stateless session strategy using JSON Web Tokens
    strategy: "jwt",
    // Token validity period: 30 days (in seconds)
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    /**
     * JWT Callback:
     * Triggered whenever a JSON Web Token is created or updated.
     * On initial sign-in, the `user` and `account` objects are provided.
     * We attach the user ID and custom claims to the encrypted JWT token.
     */
    async jwt({ token, user }) {
      if (user) {
        // user object contains the profile data from GitHub on first login
        token.id = user.id;
        token.role = user.role ?? "user";
      }
      return token;
    },

    /**
     * Session Callback:
     * Triggered whenever `auth()`, `useSession()`, or `getSession()` is called.
     * Forwards essential token data to `session.user` so it is accessible in
     * Server Components, Route Handlers, and Client Components.
     */
    async session({ session, token }) {
      if (session.user && token) {
        if (token.id) {
          session.user.id = token.id as string;
        }
        if (token.role) {
          session.user.role = token.role as string;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
});