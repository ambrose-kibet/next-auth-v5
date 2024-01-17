'use server';
import * as z from 'zod';
import { SettingsSchema } from '@/schemas';
import { getUserByEmail, getUserById } from '@/data/user';
import { currentUser } from '@/lib/autth';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/db';
import { generateVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/mail';
import { update } from '@/auth';

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const user = await currentUser();
  if (!user) {
    return {
      error: 'Forbidden',
    };
  }
  const existingUser = await getUserById(user.id);
  if (!existingUser) {
    return {
      error: 'Forbidden',
    };
  }
  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }
  if (values.email && values.email !== existingUser.email) {
    const existingEmail = await getUserByEmail(values.email);
    if (existingEmail && existingEmail.id !== user.id) {
      return {
        error: 'User already exists',
      };
    }
    const verificationToken = await generateVerificationToken(values.email);
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
      existingUser.name as string
    );
    return {
      success: 'Email sent, please verify your new email.',
    };
  }
  if (values.password && values.newPassword && existingUser.password) {
    const passwordMatch = await bcrypt.compare(
      values.password,
      existingUser.password
    );

    if (!passwordMatch) {
      return {
        error: 'Incorrect password',
      };
    }
    const hashedPassword = await bcrypt.hash(values.newPassword, 10);
    values.password = hashedPassword;
    values.newPassword = undefined;
  }
  const updatedUser = await prisma.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      ...values,
    },
  });
  return {
    success: " User's settings updated",
  };
};
