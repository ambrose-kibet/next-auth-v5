import { auth } from '@/auth';

const AdminPage = async () => {
  const session = await auth();
  return <div>AdminPage{session?.user.role}</div>;
};
export default AdminPage;
