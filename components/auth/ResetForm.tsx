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
import { ResetSchema } from '@/schemas';
import FormError from '@/components/form-error';
import FormSuccess from '@/components/form-success';
import { useTransition, useState } from 'react';
import { reset } from '@/actions/reset';
import CardWrapper from '@/components/auth/CardWrapper';

const ResetForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: '',
    },
  });
  function onSubmit(values: z.infer<typeof ResetSchema>) {
    setError('');
    setSuccess('');
    startTransition(() => {
      reset(values).then((data) => {
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
      headerLabel="Forgot your password?"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="janedoe@mail.com"
                    {...field}
                    type="email"
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
            send reset email
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
export default ResetForm;
