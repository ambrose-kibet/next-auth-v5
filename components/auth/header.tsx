import { Poppins } from 'next/font/google';
import { cn } from '@/lib/utils';

type Props = {
  label: string;
};
const font = Poppins({
  subsets: ['latin'],
  weight: ['600'],
});
const Header = (props: Props) => {
  return (
    <div className={cn('w-full space-y-4', font.className)}>
      <h1 className="text-4xl font-semibold drop-shadow-lg text-primary text-center">
        🔒Auth {/* replace this with logo */}
      </h1>
      <p className="text-sm text-muted text-center capitalize">{props.label}</p>
    </div>
  );
};
export default Header;
