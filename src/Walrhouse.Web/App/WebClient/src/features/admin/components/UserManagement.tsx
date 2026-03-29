import { useState } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table.tsx';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog.tsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge/badge.tsx';
import { UserPlus, Search, MoreHorizontal, ShieldCheck, Ban, Trash2 } from 'lucide-react';
import type { AdminUser, CreateUserPayload, UserStatus } from '../types/admin';
import { Roles, RoleVariant } from '@/features/auth/types/roles';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx';

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

const ROLE_OPTIONS = Object.values(Roles);

const emptyForm = (): CreateUserPayload => ({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  roles: [],
});

// ─── Create User Dialog ───────────────────────────────────────────────────────
function CreateUserDialog({ onCreated }: { onCreated: (u: AdminUser) => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CreateUserPayload>(emptyForm());
  const [errors, setErrors] = useState<Partial<Record<keyof CreateUserPayload, string>>>({});

  const set = (field: keyof CreateUserPayload, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const toggleRole = (role: string) =>
    setForm((f) => ({
      ...f,
      roles: f.roles.includes(role) ? f.roles.filter((r) => r !== role) : [...f.roles, role],
    }));

  const validate = () => {
    const e: typeof errors = {};
    if (!form.firstName.trim()) e.firstName = 'First name is required';
    if (!form.lastName.trim()) e.lastName = 'Last name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.password || form.password.length < 8) e.password = 'Min 8 characters';
    if (form.roles.length === 0) e.roles = 'Select at least one role';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const newUser: AdminUser = {
      id: `usr-${Date.now()}`,
      ...form,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    onCreated(newUser);
    setOpen(false);
    setForm(emptyForm());
    setErrors({});
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="sm" className="gap-2">
            <UserPlus className="h-4 w-4" />
            Add User
          </Button>
        }
      />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new warehouse account.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-medium text-foreground/70 mb-1 block">
                First Name *
              </label>
              <Input
                value={form.firstName}
                onChange={(e) => set('firstName', e.target.value)}
                placeholder="Maria"
              />
              {errors.firstName && (
                <p className="text-xs text-destructive mt-0.5">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label className="text-xs font-medium text-foreground/70 mb-1 block">
                Last Name *
              </label>
              <Input
                value={form.lastName}
                onChange={(e) => set('lastName', e.target.value)}
                placeholder="Santos"
              />
              {errors.lastName && (
                <p className="text-xs text-destructive mt-0.5">{errors.lastName}</p>
              )}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-foreground/70 mb-1 block">Middle Name</label>
            <Input
              value={form.middleName ?? ''}
              onChange={(e) => set('middleName', e.target.value)}
              placeholder="P. (optional)"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground/70 mb-1 block">Email *</label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              placeholder="user@walrhouse.com"
            />
            {errors.email && <p className="text-xs text-destructive mt-0.5">{errors.email}</p>}
          </div>
          <div>
            <label className="text-xs font-medium text-foreground/70 mb-1 block">
              Phone Number
            </label>
            <Input
              value={form.phoneNumber ?? ''}
              onChange={(e) => set('phoneNumber', e.target.value)}
              placeholder="+63 912 345 6789"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground/70 mb-1 block">Password *</label>
            <Input
              type="password"
              value={form.password}
              onChange={(e) => set('password', e.target.value)}
              placeholder="Min. 8 characters"
            />
            {errors.password && (
              <p className="text-xs text-destructive mt-0.5">{errors.password}</p>
            )}
          </div>
          <div>
            <label className="text-xs font-medium text-foreground/70 mb-1.5 block">Roles *</label>
            <div className="flex flex-wrap gap-2">
              {ROLE_OPTIONS.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => toggleRole(role)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                    form.roles.includes(role)
                      ? 'bg-foreground text-background border-foreground'
                      : 'bg-transparent text-foreground/60 border-border hover:border-foreground/40'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
            {errors.roles && <p className="text-xs text-destructive mt-1">{errors.roles}</p>}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-medium text-foreground/70 mb-1 block">City</label>
              <Input
                value={form.address?.city ?? ''}
                onChange={(e) =>
                  setForm((f) => ({ ...f, address: { ...f.address, city: e.target.value } }))
                }
                placeholder="Manila"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground/70 mb-1 block">Province</label>
              <Input
                value={form.address?.province ?? ''}
                onChange={(e) =>
                  setForm((f) => ({ ...f, address: { ...f.address, province: e.target.value } }))
                }
                placeholder="Metro Manila"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit}>Create User</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function UserManagement() {
  const [users, setUsers] = useState<AdminUser[]>(MOCK_USERS);
  const [search, setSearch] = useState('');

  const filtered = users.filter((u) =>
    `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase()),
  );

  const handleStatusChange = (id: string, status: UserStatus) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));
  };

  const handleDelete = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
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
        <CreateUserDialog onCreated={(u) => setUsers((prev) => [u, ...prev])} />
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
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
                <TableCell colSpan={8} className="text-center text-muted-foreground py-10">
                  No users found.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((user) => (
              <TableRow key={user.id}>
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
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(user.id, 'whitelisted')}
                        className="gap-2"
                      >
                        <ShieldCheck className="h-4 w-4 text-green-500" />
                        Whitelist
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(user.id, 'blacklisted')}
                        className="gap-2"
                      >
                        <Ban className="h-4 w-4 text-destructive" />
                        Blacklist
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(user.id)}
                        className="gap-2 text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
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
