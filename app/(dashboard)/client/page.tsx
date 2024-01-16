'use client';

import { Button } from '@/components/ui/button';
import UserInfo from '@/components/userInfo';
import { useSession, signOut } from 'next-auth/react';

const ClientPage = () => {
  // Accessing session in client components
  const session = useSession();

  return <UserInfo user={session.data?.user} label="📱 Client component" />;
};
export default ClientPage;
