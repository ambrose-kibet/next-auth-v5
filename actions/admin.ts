'use server';

import { auth } from '@/auth';

const protectedAdminAction = async () => {
  const session = await auth();
  if (session?.user.role !== 'ADMIN') {
    return {
      error: 'Forbidden',
    };
  }
  return {
    success: 'allowed from  server action',
  };
};
