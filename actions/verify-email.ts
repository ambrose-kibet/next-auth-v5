'use server';
import { getUserByEmail } from '@/data/user';
import { getVerificationTokenByToken } from '@/data/verification-token';
import prisma from '@/lib/db';
import { sendVerificationEmail } from '@/lib/mail';
import { generateVerificationToken } from '@/lib/tokens';
export const verifyEmail = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);
  if (!existingToken) {
    return {
      error: 'Invalid token',
    };
  }

  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return {
      error: 'Email does not exist',
    };
  }

  const hasExpired = new Date(existingToken.expiresAt) < new Date();
  if (hasExpired) {
    const newToken = await generateVerificationToken(existingToken.email);
    await sendVerificationEmail(
      newToken.email,
      newToken.token,
      existingUser.name as string
    );
    return {
      error: 'Token expired and new token sent',
    };
  }

  await prisma.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  await prisma.verificationToken.delete({
    where: {
      id: existingToken.id,
    },
  });
  return {
    success: 'Email verified successfully. Proceed to login ',
  };
};
