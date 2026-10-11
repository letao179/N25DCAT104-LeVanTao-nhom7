import { handlers } from "@/auth";

/**
 * Route Handler for NextAuth.js
 * Automatically handles OAuth flows, callbacks, session endpoints, and sign-out.
 */
export const { GET, POST } = handlers;