import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    roles?: string[];
    error?: "RefreshAccessTokenError";
  }

  interface User {
    accessToken?: string;
    expiresAt?: number;
    roles?: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    expiresAt?: number;
    roles?: string[];
    error?: "RefreshAccessTokenError";
  }
}
