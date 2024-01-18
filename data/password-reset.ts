import prisma from '@/lib/db';

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const token = await prisma.passwordResetToken.findFirst({
      where: {
        email,
      },
    });
    return token;
  } catch {
    return null;
  }
};

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: {
        token,
      },
    });
    return resetToken;
  } catch (error) {
    console.error(`Error in getPasswordResetTokenByToken: ${error}`);
    return null;
  }
};
