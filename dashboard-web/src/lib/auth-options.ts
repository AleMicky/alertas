import type { NextAuthOptions } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

type KeycloakAccessTokenPayload = {
  realm_access?: {
    roles?: string[];
  };
};

function decodeRoles(accessToken: string): string[] {
  try {
    const payload = accessToken.split(".")[1];
    if (!payload) return [];

    const decoded = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as KeycloakAccessTokenPayload;

    return decoded.realm_access?.roles ?? [];
  } catch {
    return [];
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
      issuer: process.env.KEYCLOAK_ISSUER!,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account }) {
      if (account?.access_token) {
        token.accessToken = account.access_token;
        token.roles = decodeRoles(account.access_token);
      }

      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.roles = token.roles ?? [];
      return session;
    },
  },
};
