'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { ExitIcon } from '@radix-ui/react-icons';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Input } from '@/components/ui/input';
import { settings } from '@/actions/settings';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { signOut, useSession } from 'next-auth/react';
import { useState, useTransition } from 'react';
import { SettingsSchema } from '@/schemas';
import FormSuccess from '@/components/form-success';
import FormError from '@/components/form-error';
import { Switch } from '@/components/ui/switch';

const SettingsPage = () => {
  // update session
  const session = useSession();
  const { update } = useSession();
  const [success, setSuccess] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const handleClick = (values: z.infer<typeof SettingsSchema>) => {
    setError(undefined);
    setSuccess(undefined);
    startTransition(() => {
      settings(values)
        .then((data) => {
          if (data.error) {
            setError(data.error);
          }
          if (data.success) {
            update();
            setSuccess(data.success);
          }
        })
        .catch((err) => {
          setError('something went wrong');
        });
    });
  };
  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: session.data?.user.name ?? undefined,
      email: session.data?.user.email ?? undefined,
      password: undefined,
      newPassword: undefined,
      role: session.data?.user.role ?? undefined,
      isTwoFactorEnabled: session.data?.user.isTwoFactorEnabled ?? undefined,
    },
  });
  return (
    <Card className="w-full max-w-[600px] mx-auto">
      <CardHeader>
        <h1 className="text-2xl font-semibold text-center">⚙️ Settings</h1>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleClick)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="john doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!session.data?.user.isOAuth && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="john.doe@mail.com"
                          {...field}
                          type="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="******"
                          {...field}
                          type="password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isTwoFactorEnabled"
                  render={({ field }) => (
                    <FormItem className="w-full flex items-center justify-between rounded-sm">
                      <FormLabel>
                        Enable Two Factor Authentication
                        <FormDescription>
                          Enable Two Factor Authentication for your account
                        </FormDescription>
                      </FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="USER">user</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormSuccess message={success} />
            <FormError message={error} />
            <div className="flex items-center justify-between">
              <Button type="submit" size={'sm'} disabled={isPending}>
                Update Profile
              </Button>
              <Button
                onClick={() => signOut()}
                className=""
                variant={'secondary'}
                type="button"
                disabled={isPending}
              >
                <ExitIcon className="h-4 w-4 mr-2" /> Sign out
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
export default SettingsPage;
