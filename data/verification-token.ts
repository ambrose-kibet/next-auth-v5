import prisma from '@/lib/db';

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const token = await prisma.verificationToken.findFirst({
      where: {
        email,
      },
    });
    return token;
  } catch {
    return null;
  }
};
export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: {
        token,
      },
    });
    return verificationToken;
  } catch {
    return null;
  }
};
