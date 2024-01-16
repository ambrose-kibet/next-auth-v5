import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import authConfig from '@/auth.config';
import prisma from '@/lib/db';
import { getUserById } from '@/data/user';
import { UserRole } from '@prisma/client';
import { getTwoFactorAuthenticationByUserId } from '@/data/two-factor-authentication';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    error: '/auth/error',
    signIn: '/auth/login',
  },
  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow  OAuth Signin

      if (account?.provider !== 'credentials') return true;

      // Check if user has been verified
      const existingUser = await getUserById(user.id);
      if (!existingUser?.emailVerified) {
        return false;
      }
      // Add 2FA check here
      if (existingUser && existingUser.isTwoFactorEnabled) {
        const existingTwoFactor = await getTwoFactorAuthenticationByUserId(
          existingUser.id
        );
        if (!existingTwoFactor) {
          return false;
        }
        // delete the token for next time
        await prisma.twoFactorAuthentication.delete({
          where: {
            id: existingTwoFactor.id,
          },
        });
        return true;
      }

      return true;
    },
    async session({ session, user, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }
      if (token.isTwoFactorEnabled && session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (!token.sub) {
        return token;
      }
      const existingUser = await getUserById(token.sub);
      if (!existingUser) {
        return token;
      }
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
      return token;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  ...authConfig,
});
