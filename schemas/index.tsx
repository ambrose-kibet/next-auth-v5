import { UserRole } from '@prisma/client';
import * as zod from 'zod';

export const LoginSchema = zod.object({
  email: zod
    .string({
      invalid_type_error: 'Must be a string', // first one does not have message prop
    })
    .email({ message: 'please provide a valid email' }),
  password: zod.string().min(1, { message: 'Password is required' }),
  code: zod.optional(
    zod.string().min(6, { message: 'Code must be 6 characters' })
  ),
});
export const SettingsSchema = zod
  .object({
    name: zod.optional(
      zod.string().min(3, { message: ' Name must be at least 6 characters' })
    ),
    role: zod.enum([UserRole.ADMIN, UserRole.USER]),
    email: zod.optional(
      zod.string().email({ message: 'please provide a valid email' })
    ),
    password: zod.optional(
      zod.string().min(6, { message: 'Password must be at least 6 characters' })
    ),
    newPassword: zod.optional(
      zod.string().min(6, { message: 'Password must be at least 6 characters' })
    ),
    isTwoFactorEnabled: zod.optional(zod.boolean()),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: 'new password is required if you want to change your password',
      path: ['newPassword'],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }

      return true;
    },
    {
      message:
        'current password is required if you want to change your password',
      path: ['password'],
    }
  );

export const RegistrationSchema = zod.object({
  email: zod.string().email({ message: 'please provide a valid email' }),
  password: zod
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
  name: zod.string().min(3, { message: ' Name must be at least 6 characters' }),
});
export const ResetSchema = zod.object({
  email: zod.string().email({ message: 'please provide a valid email' }),
});

export const PasswordResetSchema = zod
  .object({
    password: zod
      .string()
      .min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: zod
      .string()
      .min(6, { message: 'Password must be at least 6 characters' }),
  })
  .refine(
    (data) => {
      if (data.password !== data.confirmPassword) {
        return false;
      }

      return true;
    },
    {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    }
  );
