import { Poppins } from 'next/font/google';
import { cn } from '@/lib/utils'; // also font stuff

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import LoginButton from '@/components/auth/login-button';
// Adding fonts in next.js
const font = Poppins({
  subsets: ['latin'],
  weight: ['600'],
});

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="space-y-6">
        <h1
          className={cn(
            'text-4xl font-semibold drop-shadow-lg text-primary text-center',
            font.className
          )}
        >
          {/* font added here👆 */}
          Auth.js
        </h1>

        <p className="text-lg text-center">
          A simple, lightweight authentication library for Next.js
        </p>

        <div className="flex justify-center">
          <LoginButton mode="modal" asChildren>
            <Button size={'lg'} className="capitalize ">
              Get Started
            </Button>
          </LoginButton>
        </div>
      </div>
    </main>
  );
}
