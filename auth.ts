import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import authConfig from '@/auth.config';
import prisma from '@/lib/db';
import { getUserById } from '@/data/user';
import { UserRole } from '@prisma/client';
import { getTwoFactorAuthenticationByUserId } from '@/data/two-factor-authentication';
import { getAccountByUserId } from './data/account';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  update,
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
      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.isOAuth = token.isOAuth as boolean;
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
      const existingAccount = await getAccountByUserId(existingUser.id);

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = !!existingUser.isTwoFactorEnabled;
      return token;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  ...authConfig,
});
