'use server';
import { signIn } from '@/auth';
import { getUserByEmail } from '@/data/user';
import { getVerificationTokenByEmail } from '@/data/verification-token';
import { sendVerificationEmail } from '@/lib/mail';
import { generateVerificationToken } from '@/lib/tokens';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { LoginSchema } from '@/schemas';
import { AuthError } from 'next-auth';

import * as z from 'zod';
export const login = async (value: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(value);
  if (!validatedFields.success) {
    return {
      error: 'Invalid fields',
    };
  }
  const { email, password } = validatedFields.data;
  const existingUser = await getUserByEmail(email);
  if (!existingUser || !existingUser.password || !existingUser.email) {
    return {
      error: 'Invalid credentials',
    };
  }
  if (!existingUser.emailVerified) {
    // check if verification token exists
    const existingToken = await getVerificationTokenByEmail(email);
    if (existingToken) {
      // if yes, check if token expired
      if (existingToken.expiresAt < new Date()) {
        // if yes, delete token and send new token
        const verificationToken = await generateVerificationToken(email);
        // send email
        await sendVerificationEmail(
          verificationToken.email,
          verificationToken.token,
          existingUser.name as string
        );
        return {
          error: 'Verification token expired. New token sent',
        };
      } else {
        // if no, send error
        return {
          error: 'Please check your email to verify your account',
        };
      }
    }

    return {
      success: 'Verification email sent',
    };
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return {
            error: 'Invalid credentials',
          };

        default:
          return {
            error: 'Something went wrong',
          };
      }
    }
    throw error;
  }
};
