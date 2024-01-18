import { ExtendedUser } from '@/next-auth';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type Props = {
  user?: ExtendedUser;
  label: string;
};
const UserInfo = ({ user, label }: Props) => {
  return (
    <Card className="w-full max-w-[600px] mx-auto">
      <CardHeader>
        <p className="text-semibold text-2xl text-center capitalize">{label}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between w-full shadow-sm">
          <p className="text-sm font-medium">ID</p>
          <p className="font-mono text-xs bg-muted px-2">{user?.id}</p>
        </div>
        <div className="flex items-center justify-between w-full shadow-sm">
          <p className="text-sm font-medium">Role</p>
          <p className="font-mono text-xs bg-muted px-2">{user?.role}</p>
        </div>
        <div className="flex items-center justify-between w-full shadow-sm">
          <p className="text-sm font-medium">Email</p>
          <p className="font-mono text-xs bg-muted px-2">{user?.email}</p>
        </div>
        <div className="flex items-center justify-between w-full shadow-sm">
          <p className="text-sm font-medium">Name</p>
          <p className="font-mono text-xs bg-muted px-2">{user?.name}</p>
        </div>
        <div className="flex items-center justify-between w-full shadow-sm">
          <p className="text-sm font-medium"> Two Factor Authentication</p>

          <Badge variant={user?.isTwoFactorEnabled ? 'success' : 'destructive'}>
            {user?.isTwoFactorEnabled ? 'ON' : 'OFF'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
export default UserInfo;
