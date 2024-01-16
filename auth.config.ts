import Credentials from 'next-auth/providers/credentials';
import Github from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import type { NextAuthConfig } from 'next-auth';
import { getUserByEmail } from '@/data/user';
import { LoginSchema } from '@/schemas';

export default {
  providers: [
    Github({
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      clientId: process.env.GITHUB_CLIENT_ID,
    }),
    Google({
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      clientId: process.env.GOOGLE_CLIENT_ID,
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);
        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          const user = await getUserByEmail(email);
          if (!user || !user.password) {
            return null;
          }
          const isValid = await bcrypt.compare(password, user.password);
          if (isValid) {
            return user;
          }
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
