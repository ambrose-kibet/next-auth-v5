'use client';
import { FcAbout, FcGoogle } from 'react-icons/fc';
import { signIn } from 'next-auth/react';
import { FaGithub } from 'react-icons/fa6';
import { Button } from '../ui/button';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { useSearchParams } from 'next/navigation';
const Socials = () => {
  const urlParams = useSearchParams();
  const callBackUrl = urlParams.get('callbackUrl');

  const handleClick = (provider: 'google' | 'github') => {
    signIn(provider), { callbackUrl: callBackUrl || DEFAULT_LOGIN_REDIRECT };
  };
  return (
    <div className="flex items-center gap-x-4 mx-auto">
      <Button
        size="lg"
        className="w-full"
        variant={'ghost'}
        onClick={() => handleClick('google')}
      >
        <FcGoogle className="w-6 h-6" />
      </Button>
      <Button
        size="lg"
        className="w-full"
        variant={'ghost'}
        onClick={() => handleClick('github')}
      >
        <FaGithub className="w-6 h-6" />
      </Button>
    </div>
  );
};
export default Socials;
