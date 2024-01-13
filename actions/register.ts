'use server';

import * as z from 'zod';
import { RegistrationSchema } from '@/schemas';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/db';

export const register = async (values: z.infer<typeof RegistrationSchema>) => {
  const validatedFields = RegistrationSchema.safeParse(values);
  if (!validatedFields.success) {
    return {
      error: 'Invalid Fields',
    };
  }
  const { email, name, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  // check if email is already registered
  // if not, send email
  // if yes, return error
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (existingUser) {
    return {
      error: 'Email already registered',
    };
  }
  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
  });
  return {
    success: 'Email sent',
  };
};
