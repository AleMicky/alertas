import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { authenticateWithApi } from "@/lib/api-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credenciales",
      credentials: {
        username: { label: "Usuario", type: "text" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          const user = await authenticateWithApi(
            credentials.username,
            credentials.password,
          );

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            accessToken: user.accessToken,
            expiresAt: user.expiresAt,
            roles: user.roles,
          };
        } catch {
          return null;
        }
      },
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
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.expiresAt = user.expiresAt;
        token.roles = user.roles ?? [];
        return token;
      }

      if (token.expiresAt && Date.now() < token.expiresAt - 30_000) {
        return token;
      }

      return { ...token, error: "RefreshAccessTokenError" };
    },
    async session({ session, token }) {
      if (token.error === "RefreshAccessTokenError") {
        session.error = "RefreshAccessTokenError";
      }

      session.accessToken = token.accessToken;
      session.roles = token.roles ?? [];
      return session;
    },
  },
};
