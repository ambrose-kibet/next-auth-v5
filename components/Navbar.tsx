'use client';
import Link from 'next/link';
import { Button } from './ui/button';
import { ModeToggle } from './ThemeToggler';
import { usePathname } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FaBars } from 'react-icons/fa6';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { signOut, useSession } from 'next-auth/react';

const Navbar = () => {
  const links: { label: string; href: string }[] = [
    { label: 'client', href: '/client' },
    { label: 'server', href: '/server' },
    { label: 'Settings', href: '/settings' },
  ];
  const pathname = usePathname();
  const session = useSession();
  return (
    <nav className="w-full">
      <div className=" max-w-screen-xl w-full flex items-start justify-between mx-auto py-4 ">
        <DropdownMenu>
          <DropdownMenuTrigger className="md:hidden ml-1">
            <Avatar>
              <AvatarImage src={session.data?.user.image || ''} />
              <AvatarFallback>
                {session.data?.user.name?.substring(0, 1)}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {links.map(({ label, href }) => (
              <DropdownMenuItem key={href}>
                <Button
                  variant={'ghost'}
                  size={'lg'}
                  className="capitalize"
                  asChild
                >
                  <Link
                    href={href}
                    className={`font-medium ${
                      pathname === href ? 'text-primary' : null
                    }`}
                  >
                    {label}
                  </Link>
                </Button>
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem>
              <Button
                variant={'ghost'}
                size={'lg'}
                className="capitalize"
                onClick={() => signOut()}
              >
                Logout
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ul className="hidden items-center justify-center space-x-4 md:flex ">
          {links.map(({ label, href }) => (
            <li key={href}>
              <Button
                variant={'ghost'}
                size={'lg'}
                className="capitalize"
                asChild
              >
                <Link
                  href={href}
                  className={`font-medium ${
                    pathname === href ? 'text-primary' : null
                  }`}
                >
                  {label}
                </Link>
              </Button>
            </li>
          ))}
          {session.data?.user.role === 'ADMIN' && (
            <li>
              <Button
                variant={'ghost'}
                size={'lg'}
                className="capitalize"
                asChild
              >
                <Link href={'/admin'} className={`font-medium`}>
                  Admin
                </Link>
              </Button>
            </li>
          )}
        </ul>
        <div className="flex items-center pr-1 ">
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
