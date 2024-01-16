import { PropsWithChildren } from 'react';

const layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="min-h-screen  min-w-screen flex flex-col justify-center items-center px-2">
      {children}
    </div>
  );
};
export default layout;
