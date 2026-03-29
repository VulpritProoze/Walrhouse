import { useState, useEffect, type ReactElement } from 'react';
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
import {
  Field,
  FieldLabel,
  FieldError,
} from '@/components/ui/field.tsx';
import { Roles } from '@/features/auth/types/roles';
import type { AdminUser, CreateUserPayload } from '../../types/admin';

const ROLE_OPTIONS = Object.values(Roles);

const emptyForm = (): CreateUserPayload => ({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  roles: [],
});

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: AdminUser | null;
  onSave: (u: AdminUser) => void;
  trigger?: ReactElement;
}

export function UserFormDialog({
  open,
  onOpenChange,
  user,
  onSave,
  trigger,
}: UserFormDialogProps) {
  const isEdit = !!user;

  const [form, setForm] = useState<CreateUserPayload>(() =>
    user
      ? {
          firstName: user.firstName,
          middleName: user.middleName,
          lastName: user.lastName,
          email: user.email,
          password: '',
          roles: user.roles,
          address: user.address,
        }
      : emptyForm(),
  );

  const [errors, setErrors] = useState<Partial<Record<keyof CreateUserPayload, string>>>({});

  useEffect(() => {
    if (open) {
      if (user) {
        setForm({
          firstName: user.firstName,
          middleName: user.middleName,
          lastName: user.lastName,
          email: user.email,
          password: '',
          roles: user.roles,
          address: user.address,
        });
      } else {
        setForm(emptyForm());
      }
      setErrors({});
    }
  }, [open, user]);

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
    if (!isEdit) {
      if (!form.email.trim()) e.email = 'Email is required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
      if (!form.password || form.password.length < 8) e.password = 'Min 8 characters';
    }
    if (form.roles.length === 0) e.roles = 'Select at least one role';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const result: AdminUser = {
      id: user?.id ?? `usr-${Date.now()}`,
      ...form,
      status: user?.status ?? 'active',
      createdAt: user?.createdAt ?? new Date().toISOString(),
      lastLogin: user?.lastLogin,
    };
    onSave(result);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger render={trigger} />}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Update User' : 'Create New User'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the user's information and permissions."
              : 'Fill in the details to create a new warehouse account.'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>First Name *</FieldLabel>
              <Input
                value={form.firstName}
                onChange={(e) => set('firstName', e.target.value)}
                placeholder="Maria"
              />
              <FieldError>{errors.firstName}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Last Name *</FieldLabel>
              <Input
                value={form.lastName}
                onChange={(e) => set('lastName', e.target.value)}
                placeholder="Santos"
              />
              <FieldError>{errors.lastName}</FieldError>
            </Field>
          </div>

          <Field>
            <FieldLabel>Middle Name</FieldLabel>
            <Input
              value={form.middleName ?? ''}
              onChange={(e) => set('middleName', e.target.value)}
              placeholder="P. (optional)"
            />
          </Field>

          {!isEdit && (
            <>
              <Field>
                <FieldLabel>Email *</FieldLabel>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  placeholder="user@walrhouse.com"
                />
                <FieldError>{errors.email}</FieldError>
              </Field>

              <Field>
                <FieldLabel>Password *</FieldLabel>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(e) => set('password', e.target.value)}
                  placeholder="Min. 8 characters"
                />
                <FieldError>{errors.password}</FieldError>
              </Field>
            </>
          )}

          <Field>
            <FieldLabel>Phone Number</FieldLabel>
            <Input
              value={form.phoneNumber ?? ''}
              onChange={(e) => set('phoneNumber', e.target.value)}
              placeholder="+63 912 345 6789"
            />
          </Field>

          <Field>
            <FieldLabel>Roles *</FieldLabel>
            <div className="flex flex-wrap gap-2">
              {ROLE_OPTIONS.map((role) => (
                <Button
                  key={role}
                  variant={form.roles.includes(role) ? 'default' : 'outline'}
                  size="xs"
                  className="rounded-full font-medium"
                  onClick={() => toggleRole(role)}
                >
                  {role}
                </Button>
              ))}
            </div>
            <FieldError>{errors.roles}</FieldError>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>City</FieldLabel>
              <Input
                value={form.address?.city ?? ''}
                onChange={(e) =>
                  setForm((f) => ({ ...f, address: { ...f.address, city: e.target.value } }))
                }
                placeholder="Manila"
              />
            </Field>

            <Field>
              <FieldLabel>Province</FieldLabel>
              <Input
                value={form.address?.province ?? ''}
                onChange={(e) =>
                  setForm((f) => ({ ...f, address: { ...f.address, province: e.target.value } }))
                }
                placeholder="Metro Manila"
              />
            </Field>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit}>{isEdit ? 'Update User' : 'Create User'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
