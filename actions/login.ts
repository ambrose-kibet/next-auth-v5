'use server';
import { LoginSchema } from '@/schemas';

import * as z from 'zod';
export const login = async (value: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(value);
  if (!validatedFields.success) {
    return {
      error: 'Invalid fields',
    };
  }
  return {
    success: 'email sent',
  };
};
