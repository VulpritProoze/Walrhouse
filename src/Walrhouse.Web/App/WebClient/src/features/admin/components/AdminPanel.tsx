import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs/tabs.tsx';
import { Users, ShieldAlert } from 'lucide-react';
import UserManagement from './UserManagement';
import SecurityModule from './SecurityModule';

export default function AdminPanel() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold">Admin Panel</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage users, roles, and system security settings.
        </p>
      </div>

      <Tabs defaultValue="users">
        <TabsList variant="line" className="w-full justify-start border-b rounded-none px-0 h-10 gap-4">
          <TabsTrigger value="users" className="after:bottom-0 gap-1.5">
            <Users className="h-4 w-4" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="security" className="after:bottom-0 gap-1.5">
            <ShieldAlert className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
          <UserManagement />
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <SecurityModule />
        </TabsContent>
      </Tabs>
    </div>
  );
}
