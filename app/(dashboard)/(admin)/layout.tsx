import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { PropsWithChildren } from 'react';

const AdminLayout = async ({ children }: PropsWithChildren) => {
  const session = await auth();

  if (session?.user.role !== 'ADMIN') return redirect('/settings');
  return <div>{children}</div>;
};
export default AdminLayout;
