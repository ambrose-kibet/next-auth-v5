import Link from 'next/link';
import { Button } from '../ui/button';

type Props = {
  backButtonLabel: string;
  backButtonHref: string;
};
const BackButton = ({ backButtonHref, backButtonLabel }: Props) => {
  return (
    <div className="flex items-center w-full justify-center">
      <Button asChild variant={'link'} className="font-normal">
        <Link href={backButtonHref}>{backButtonLabel}</Link>
      </Button>
    </div>
  );
};
export default BackButton;
