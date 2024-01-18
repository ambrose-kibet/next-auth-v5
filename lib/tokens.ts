import { getVerificationTokenByEmail } from '@/data/verification-token';
import { v4 as uuidv4 } from 'uuid';
import prisma from '@/lib/db';
import crypto from 'crypto';
import { getPasswordResetTokenByEmail } from '@/data/password-reset';
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token';

export const generateVerificationToken = async (email: string) => {
  const existingToken = await getVerificationTokenByEmail(email);
  const token = uuidv4();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60);
  if (existingToken) {
    await prisma.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }
  const newToken = await prisma.verificationToken.create({
    data: {
      email,
      token,
      expiresAt,
    },
  });
  return newToken;
};

export const generateResetToken = async (email: string) => {
  const existingToken = await getPasswordResetTokenByEmail(email);
  const token = uuidv4();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 5);
  if (existingToken) {
    await prisma.passwordResetToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }
  const newToken = await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expiresAt,
    },
  });
  return newToken;
};

export const generateTwoFactorToken = async (email: string) => {
  const existingToken = await getTwoFactorTokenByEmail(email);
  const token = crypto.randomInt(100000, 999999).toString();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 10);
  if (existingToken) {
    await prisma.twoFactorToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }
  const newToken = await prisma.twoFactorToken.create({
    data: {
      email,
      token,
      expiresAt,
    },
  });
  return newToken;
};
