import { useState } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table.tsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge/badge.tsx';
import {
  UserPlus,
  Search,
  MoreHorizontal,
  ShieldCheck,
  Ban,
  UserX,
  UserCog,
  Mail,
  Key,
} from 'lucide-react';
import type { AdminUser, UserStatus } from '../types/admin';
import { Roles, RoleVariant } from '@/features/auth/types/roles';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx';
import { UserFormDialog } from './dialogs/UserFormDialog';
import { EmailUpdateDialog } from './dialogs/EmailUpdateDialog';
import { PasswordUpdateDialog } from './dialogs/PasswordUpdateDialog';

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_USERS: AdminUser[] = [
  {
    id: 'usr-001',
    firstName: 'Maria',
    lastName: 'Santos',
    email: 'maria.santos@walrhouse.com',
    phoneNumber: '+63 912 345 6789',
    roles: [Roles.Administrator],
    status: 'active',
    address: { street: '12 Rizal Ave', city: 'Manila', province: 'Metro Manila' },
    lastLogin: '2026-03-29T09:12:00Z',
    createdAt: '2025-01-15T08:00:00Z',
  },
  {
    id: 'usr-002',
    firstName: 'Jose',
    middleName: 'P.',
    lastName: 'Reyes',
    email: 'jose.reyes@walrhouse.com',
    phoneNumber: '+63 917 654 3210',
    roles: [Roles.WarehouseAdministrator],
    status: 'active',
    address: { city: 'Quezon City', province: 'Metro Manila' },
    lastLogin: '2026-03-28T14:30:00Z',
    createdAt: '2025-02-10T08:00:00Z',
  },
  {
    id: 'usr-003',
    firstName: 'Ana',
    lastName: 'Garcia',
    email: 'ana.garcia@walrhouse.com',
    roles: [Roles.InventoryClerk],
    status: 'whitelisted',
    lastLogin: '2026-03-27T11:00:00Z',
    createdAt: '2025-03-01T08:00:00Z',
  },
  {
    id: 'usr-004',
    firstName: 'Carlos',
    lastName: 'Mendoza',
    email: 'carlos.m@walrhouse.com',
    roles: [Roles.InventoryController],
    status: 'blacklisted',
    lastLogin: '2026-03-10T09:00:00Z',
    createdAt: '2025-03-15T08:00:00Z',
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const STATUS_VARIANT: Record<UserStatus, 'default' | 'success' | 'destructive' | 'warning'> = {
  active: 'success',
  whitelisted: 'default',
  blacklisted: 'destructive',
  suspended: 'warning',
};

// ─── Main component ───────────────────────────────────────────────────────────
export default function UserManagement() {
  const [users, setUsers] = useState<AdminUser[]>(MOCK_USERS);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [passDialogOpen, setPassDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [lastClickedId, setLastClickedId] = useState<string | null>(null);

  const filtered = users.filter((u) =>
    `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase()),
  );

  const isAllSelected = filtered.length > 0 && selectedIds.size === filtered.length;

  const toggleAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(filtered.map((u) => u.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const toggleSelection = (id: string, shiftKey?: boolean) => {
    const next = new Set(selectedIds);

    if (shiftKey && lastClickedId) {
      const fromIndex = filtered.findIndex((u) => u.id === lastClickedId);
      const toIndex = filtered.findIndex((u) => u.id === id);

      if (fromIndex !== -1 && toIndex !== -1) {
        const start = Math.min(fromIndex, toIndex);
        const end = Math.max(fromIndex, toIndex);
        const range = filtered.slice(start, end + 1);

        range.forEach((u) => next.add(u.id));
        setSelectedIds(next);
        setLastClickedId(id);
        return;
      }
    }

    if (next.has(id)) next.delete(id);
    else next.add(id);

    setSelectedIds(next);
    setLastClickedId(id);
  };

  const clearSelection = () => setSelectedIds(new Set());

  const handleBulkStatusChange = (status: UserStatus) => {
    setUsers((prev) => prev.map((u) => (selectedIds.has(u.id) ? { ...u, status } : u)));
    clearSelection();
  };

  const handleEdit = (user: AdminUser) => {
    setEditingUser(user);
    setDialogOpen(true);
  };

  const handleEditEmail = (user: AdminUser) => {
    setEditingUser(user);
    setEmailDialogOpen(true);
  };

  const handleResetPassword = (user: AdminUser) => {
    setEditingUser(user);
    setPassDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingUser(null);
    setDialogOpen(true);
  };

  const handleSave = (user: AdminUser) => {
    if (editingUser) {
      setUsers((prev) => prev.map((u) => (u.id === user.id ? user : u)));
    } else {
      setUsers((prev) => [user, ...prev]);
    }
  };

  const handleEmailSave = (id: string, email: string) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, email } : u)));
  };

  const handlePasswordSave = (id: string, pass: string) => {
    // In a real app, this would be a secure API call
    console.log(`Password reset for ${id} (new pass: ${pass.length} chars)`);
  };

  const handleStatusChange = (id: string, status: UserStatus) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));
  };

  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [deactivatingUser, setDeactivatingUser] = useState<AdminUser | null>(null);

  const handleDeactivate = (user: AdminUser) => {
    setDeactivatingUser(user);
    setDeactivateDialogOpen(true);
  };

  const confirmDeactivate = () => {
    if (!deactivatingUser) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === deactivatingUser.id ? { ...u, status: 'suspended' } : u)),
    );
    setDeactivateDialogOpen(false);
    setDeactivatingUser(null);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users…"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {selectedIds.size > 0 ? (
          <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-200">
            <span className="text-sm font-medium text-muted-foreground mr-2">
              {selectedIds.size} selected
            </span>
            <Button
              size="sm"
              variant="outline"
              className="gap-2 h-8"
              onClick={() => handleBulkStatusChange('whitelisted')}
            >
              <ShieldCheck className="h-4 w-4" />
              Whitelist
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="gap-2 h-8"
              onClick={() => handleBulkStatusChange('blacklisted')}
            >
              <Ban className="h-4 w-4" />
              Blacklist
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="px-2 h-8 text-muted-foreground"
              onClick={clearSelection}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <UserFormDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            user={editingUser}
            onSave={handleSave}
            trigger={
              <Button size="sm" className="gap-2" onClick={handleCreate}>
                <UserPlus className="h-4 w-4" />
                Add User
              </Button>
            }
          />
        )}

        {editingUser && (
          <>
            <EmailUpdateDialog
              open={emailDialogOpen}
              onOpenChange={setEmailDialogOpen}
              user={editingUser}
              onSave={handleEmailSave}
            />
            <PasswordUpdateDialog
              open={passDialogOpen}
              onOpenChange={setPassDialogOpen}
              user={editingUser}
              onSave={handlePasswordSave}
            />
          </>
        )}

        <AlertDialog open={deactivateDialogOpen} onOpenChange={setDeactivateDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Deactivate user</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to deactivate this user?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel variant="outline" onClick={() => setDeactivateDialogOpen(false)}>
                No
              </AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={confirmDeactivate}>
                Yes
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card overflow-hidden select-none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={toggleAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right pr-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground py-10">
                  No users found.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((user) => (
              <TableRow
                key={user.id}
                data-selected={selectedIds.has(user.id)}
                className="data-[selected=true]:bg-muted/50"
              >
                <TableCell className="w-[50px]">
                  <div
                    onClick={(e) => {
                      // We handle the selection logic here to capture e.shiftKey
                      // Preventing default on the div avoids double trigger if Checkbox has its own handler
                      toggleSelection(user.id, e.shiftKey);
                    }}
                  >
                    <Checkbox
                      checked={selectedIds.has(user.id)}
                      // We pass an empty function here as we handle logic in the wrapper's onClick
                      onCheckedChange={() => {}}
                      aria-label={`Select ${user.firstName}`}
                      className="cursor-pointer"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{user.id}</TableCell>
                <TableCell>
                  <div className="font-medium">
                    {user.firstName} {user.middleName ? `${user.middleName} ` : ''}
                    {user.lastName}
                  </div>
                  {user.lastLogin && (
                    <div className="text-xs text-muted-foreground">
                      Last login: {new Date(user.lastLogin).toLocaleDateString()}
                    </div>
                  )}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.phoneNumber ?? <span className="text-muted-foreground">—</span>}
                </TableCell>
                <TableCell>
                  {user.address?.city ? (
                    `${user.address.city}${user.address.province ? `, ${user.address.province}` : ''}`
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {user.roles.map((r) => (
                      <Badge
                        key={r}
                        variant={RoleVariant[r] || 'default'}
                        className="text-[10px] whitespace-nowrap"
                      >
                        {r}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[user.status]} className="capitalize text-[10px]">
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      }
                    />
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => handleEdit(user)} className="gap-2">
                        <UserCog className="h-4 w-4 text-muted-foreground" />
                        Edit Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditEmail(user)} className="gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        Update Email
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleResetPassword(user)} className="gap-2">
                        <Key className="h-4 w-4 text-muted-foreground" />
                        Reset Password
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="gap-2 text-destructive"
                        onClick={() => handleDeactivate(user)}
                      >
                        <UserX className="h-4 w-4" />
                        Deactivate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(user.id, 'whitelisted')}
                        className="gap-2"
                      >
                        <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                        Whitelist
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(user.id, 'blacklisted')}
                        className="gap-2"
                      >
                        <Ban className="h-4 w-4 text-muted-foreground" />
                        Blacklist
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <p className="text-xs text-muted-foreground">
        {filtered.length} user{filtered.length !== 1 ? 's' : ''}
      </p>
    </div>
  );
}
