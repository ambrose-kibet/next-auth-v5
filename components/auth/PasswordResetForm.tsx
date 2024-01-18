'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PasswordResetSchema } from '@/schemas';
import FormError from '@/components/form-error';
import FormSuccess from '@/components/form-success';
import { useTransition, useState } from 'react';
import CardWrapper from '@/components/auth/CardWrapper';
import { newPassword } from '@/actions/new-password';
import { useSearchParams } from 'next/navigation';

const ResetPasswordForm = () => {
  const useParams = useSearchParams();
  const token = useParams.get('token');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const form = useForm<z.infer<typeof PasswordResetSchema>>({
    resolver: zodResolver(PasswordResetSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });
  function onSubmit(values: z.infer<typeof PasswordResetSchema>) {
    setError('');
    setSuccess('');
    startTransition(() => {
      newPassword(values, token).then((data) => {
        if (data?.error) {
          setError(data.error);
        } else if (data?.success) {
          setSuccess(data?.success);
        }
      });
    });
  }
  return (
    <CardWrapper
      backButtonLabel="Back to login"
      backButtonLink="/auth/login"
      headerLabel="Enter your new password"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="******"
                    {...field}
                    type="password"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="******"
                    {...field}
                    type="password"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormError message={error} />
          <FormSuccess message={success} />
          <Button type="submit" className="w-full" disabled={isPending}>
            Reset password
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
export default ResetPasswordForm;
