import prisma from '@/lib/db';

export const getTwoFactorAuthenticationByUserId = async (userId: string) => {
  try {
    const twoFactorAuthentication =
      await prisma.twoFactorAuthentication.findFirst({
        where: {
          userId,
        },
      });
    return twoFactorAuthentication;
  } catch {
    return null;
  }
};
