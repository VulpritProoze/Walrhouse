import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { LogIn } from 'lucide-react';
import { loginSchema, type LoginCredentials } from '../types/types';
import { login as apiLogin, getAuthenticatedUserInfo } from '../api/auth.service';
import { useAuth } from '../hooks/use-auth';
import type { AxiosError } from 'axios';
import { toast } from 'sonner';

type Props = {
  initial?: LoginCredentials;
  onSuccess?: () => void;
};

export default function LoginForm({ initial, onSuccess }: Props) {
  const [identifier, setIdentifier] = useState(initial?.identifier ?? '');
  const [password, setPassword] = useState(initial?.password ?? '');
  const [loading, setLoading] = useState(false);

  const { login: contextLogin } = useAuth();

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setLoading(true);
      const creds = loginSchema.parse({ identifier, password });

      // 1. Perform the login (cookie mode)
      await apiLogin(
        {
          email: creds.identifier,
          password: creds.password,
        },
        true,
      );

      // 2. Fetch user information to populate the context
      const { data: userInfo } = await getAuthenticatedUserInfo();

      // 3. Update global auth state
      contextLogin({
        id: userInfo.id,
        email: userInfo.email,
        roles: userInfo.roles,
      });

      toast.success('Welcome back!', {
        description: `Logged in as ${userInfo.email}`,
      });

      onSuccess?.();
    } catch (err) {
      const axiosError = err as AxiosError<{ detail?: string; title?: string }>;
      const apiMessage = axiosError.response?.data?.detail || axiosError.response?.data?.title;

      toast.error(apiMessage || 'An unexpected error occurred during sign in.');

      if (import.meta.env.DEV) {
        console.error('Login error:', err);
      }
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

      <div className="flex items-center justify-between gap-2">
        <Button type="submit" disabled={loading} className="flex-1" size="lg">
          {loading ? (
            <Spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <LogIn className="mr-2 h-4 w-4" />
          )}
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>
      </div>
    </form>
  );
}
