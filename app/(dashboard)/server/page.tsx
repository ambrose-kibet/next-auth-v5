import { auth } from '@/auth';
import UserInfo from '@/components/userInfo';

const ServerPage = async () => {
  const session = await auth();
  return <UserInfo user={session?.user} label="💻 server component" />;
};
export default ServerPage;
