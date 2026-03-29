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

interface EmailUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AdminUser;
  onSave: (id: string, email: string) => void;
}

export function EmailUpdateDialog({
  open,
  onOpenChange,
  user,
  onSave,
}: EmailUpdateDialogProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setEmail(user.email);
      setError('');
    }
  }, [open, user]);

  const handleSubmit = () => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('A valid email address is required');
      return;
    }
    onSave(user.id, email);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Email Address</DialogTitle>
          <DialogDescription>
            Change the login email for <strong>{user.firstName}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Field>
            <FieldLabel>New Email Address</FieldLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="new-email@walrhouse.com"
            />
            {error && <FieldError>{error}</FieldError>}
          </Field>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit}>Update Email</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
