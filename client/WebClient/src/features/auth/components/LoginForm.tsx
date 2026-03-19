import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn } from 'lucide-react';
import { loginSchema, type LoginCredentials } from '../types/types';

type Props = {
  initial?: LoginCredentials;
  onSuccess?: (creds: LoginCredentials) => void;
};

export default function LoginForm({ initial, onSuccess }: Props) {
  const [identifier, setIdentifier] = useState(initial?.identifier ?? '');
  const [password, setPassword] = useState(initial?.password ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      const creds = loginSchema.parse({ identifier, password });
      // TODO: replace with real auth call
      await new Promise((r) => setTimeout(r, 600));
      onSuccess?.(creds);
    } catch {
      setError('Sign in failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="identifier" className="block">
          Username or email
        </Label>
        <Input
          id="identifier"
          autoFocus
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="scan or type to sign in"
          aria-label="username or email"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="password" className="block">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="your password"
          aria-label="password"
          className="mt-1"
        />
      </div>

      {error && <div className="text-sm text-destructive">{error}</div>}

      <div className="flex items-center justify-between gap-2">
        <Button type="submit" disabled={loading} className="flex-1" size="lg">
          <LogIn className="mr-2" />
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>
      </div>
    </form>
  );
}
