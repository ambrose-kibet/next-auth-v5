'use server';
import { signIn } from '@/auth';
import { getTwoFactorAuthenticationByUserId } from '@/data/two-factor-authentication';
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token';
import { getUserByEmail } from '@/data/user';
import { getVerificationTokenByEmail } from '@/data/verification-token';
import prisma from '@/lib/db';
import { sendVerificationEmail, sendTwoFactorToken } from '@/lib/mail';
import {
  generateTwoFactorToken,
  generateVerificationToken,
} from '@/lib/tokens';
import bcrypt from 'bcryptjs';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { LoginSchema } from '@/schemas';
import { AuthError } from 'next-auth';

import * as z from 'zod';
export const login = async (
  value: z.infer<typeof LoginSchema>,
  callBackUrl?: string | null
) => {
  const validatedFields = LoginSchema.safeParse(value);
  if (!validatedFields.success) {
    return {
      error: 'Invalid fields',
    };
  }
  const { email, password, code } = validatedFields.data;
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
      if (new Date(existingToken.expiresAt) < new Date()) {
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
  // check if password exists compare before sending 2FA token
  if (existingUser.password) {
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return {
        error: 'Invalid credentials',
      };
    }
  }
  if (existingUser.isTwoFactorEnabled) {
    if (!code) {
      const twoFactorToken = await generateTwoFactorToken(email);
      await sendTwoFactorToken(twoFactorToken.email, twoFactorToken.token);
      return {
        twoFactor: true,
      };
    } else {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
      if (!twoFactorToken) {
        return {
          error: 'Invalid credentials',
        };
      }
      if (twoFactorToken.token !== code) {
        return {
          error: 'Invalid code',
        };
      }
      const hasExpired = new Date(twoFactorToken.expiresAt) < new Date();
      if (hasExpired) {
        return {
          error: 'Code has expired',
        };
      }

      // delete the token for next time
      await prisma.twoFactorToken.delete({
        where: {
          id: twoFactorToken.id,
        },
      });
      // create 2FA record
      const existingTwoFactorAuthentication =
        await getTwoFactorAuthenticationByUserId(existingUser.id);
      if (existingTwoFactorAuthentication) {
        await prisma.twoFactorAuthentication.delete({
          where: {
            id: existingTwoFactorAuthentication.id,
          },
        });
      }
      await prisma.twoFactorAuthentication.create({
        data: {
          userId: existingUser.id,
        },
      });
    }
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: callBackUrl || DEFAULT_LOGIN_REDIRECT,
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
