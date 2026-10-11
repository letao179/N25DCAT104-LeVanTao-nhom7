import type { DefaultSession } from "next-auth";
import type { JWT as DefaultJWT } from "next-auth/jwt";

/**
 * Module augmentation for `next-auth` types.
 * Allows strict typing for extended properties on Session and User.
 */
declare module "next-auth" {
  interface Session {
    user: {
      /** The unique identifier of the user (extracted from JWT token). */
      id?: string;
      /** Optional role for role-based access control (RBAC). */
      role?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    role?: string;
  }
}

/**
 * Module augmentation for `next-auth/jwt` types.
 * Allows strict typing for extended properties on the JWT payload.
 */
declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    /** The unique identifier of the user persisted in JWT. */
    id?: string;
    /** Optional role persisted in JWT. */
    role?: string;
  }
}
