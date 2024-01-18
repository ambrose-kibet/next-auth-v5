import { CheckCircledIcon } from '@radix-ui/react-icons';

type Props = { message?: string };
const FormSuccess = ({ message }: Props) => {
  if (!message) return null;
  return (
    <div className=" w-full bg-emerald-500/15 flex items-center gap-x-2 text-emerald-500 p-3 text-sm rounded-md">
      <CheckCircledIcon className="w-4 h-4" /> <p>{message}</p>
    </div>
  );
};
export default FormSuccess;
