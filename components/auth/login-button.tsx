'use client';
// use this for reuseable login button
import { useRouter, useSearchParams } from 'next/navigation';
type Props = {
  mode?: 'redirect' | 'modal';
  children: React.ReactNode;
  asChildren?: boolean;
};
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import LoginForm from '@/components/auth/LoginForm';
import CardWrapper from '@/components/auth/CardWrapper';
import { useSession } from 'next-auth/react';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';

const LoginButton = ({ children, mode = 'redirect', asChildren }: Props) => {
  const router = useRouter();
  const useParams = useSearchParams();
  const callBackUrl = useParams.get('callbackUrl') || DEFAULT_LOGIN_REDIRECT;
  const session = useSession();

  const handleClick = () => {
    router.push('/auth/login');
  };
  if (session.data?.user) {
    router.push(callBackUrl);
    return;
  }

  if (mode === 'modal') {
    return (
      <Dialog>
        <DialogTrigger asChild={asChildren}>{children}</DialogTrigger>
        <DialogContent className="p-0 w-auto bg-transparent border-none">
          <CardWrapper
            backButtonLabel="Don't have an account?"
            showSocials
            backButtonLink="/auth/register"
            headerLabel="welcome back"
          >
            <LoginForm />
          </CardWrapper>
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <span onClick={handleClick} className="cursor-pointer">
      {children}
    </span>
  );
};
export default LoginButton;
