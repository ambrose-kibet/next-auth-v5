import { PropsWithChildren } from 'react';
import Navbar from '@/components/Navbar';

const ProtectedLayout = ({ children }: PropsWithChildren) => {
  return (
    <div>
      <Navbar />
      <div className="max-w-screen-xl  min-h-[calc(100vh-4.5rem)] p-6 mx-auto flex flex-col">
        {children}
      </div>
    </div>
  );
};
export default ProtectedLayout;
