'use server';
import { ResetSchema } from '@/schemas';
import * as z from 'zod';
import { getUserByEmail } from '@/data/user';
import { generateResetToken } from '@/lib/tokens';
import { sendPasswordResetEmail } from '@/lib/mail';

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);
  if (!validatedFields.success) {
    return {
      error: 'Invalid Fields',
    };
  }
  const { email } = validatedFields.data;
  const existingUser = await getUserByEmail(email);
  if (!existingUser) {
    return {
      error: 'Email not registered',
    };
  }
  // send email

  const newToken = await generateResetToken(existingUser.email as string);

  await sendPasswordResetEmail(
    newToken.email,
    newToken.token,
    existingUser.name as string
  );

  return {
    success: 'Reset email sent',
  };
};
