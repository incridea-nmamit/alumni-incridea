import { PrismaAdapter } from "@auth/prisma-adapter";
import { type Role } from "@prisma/client";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { env } from "~/env";

import { db } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: number;
      email: string;
      passClaimed: boolean;
      attendedDay1: boolean;
      attendedDay2: boolean;
      role: Role;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  adapter: PrismaAdapter(db),
  callbacks: {
    session: async ({ session, user }) => {
      const dbUser = await db.user.findUnique({
        where: { email: user.email },
      });
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          email: user.email,
          role: dbUser?.role ?? "USER",
          attendedDay1: dbUser?.attendedDay1 ?? false,
          attendedDay2: dbUser?.attendedDay2 ?? false,
        },
      };
    },
  },
} satisfies NextAuthConfig;
