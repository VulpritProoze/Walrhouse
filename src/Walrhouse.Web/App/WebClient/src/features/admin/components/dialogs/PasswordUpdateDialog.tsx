import { useState, useEffect } from 'react';
import {
  Dialog,
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
import type { AdminUser } from '../../types/admin';

interface PasswordUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AdminUser;
  onSave: (id: string, pass: string) => void;
}

export function PasswordUpdateDialog({
  open,
  onOpenChange,
  user,
  onSave,
}: PasswordUpdateDialogProps) {
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setPass('');
      setError('');
    }
  }, [open, user]);

  const handleSubmit = () => {
    if (pass.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    onSave(user.id, pass);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            Reset the password for <strong>{user.firstName} {user.lastName}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Field>
            <FieldLabel>New Password</FieldLabel>
            <Input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="Min. 8 characters"
            />
            {error && <FieldError>{error}</FieldError>}
          </Field>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit}>Reset Password</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
