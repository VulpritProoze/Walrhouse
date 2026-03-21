import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Spinner } from '@/components/ui/spinner';
import { LogIn, Info } from 'lucide-react';
import { loginSchema, type LoginCredentials } from '../types/types';
import { login as apiLogin, getAuthenticatedUserInfo } from '../api/auth.service';
import { useAuth } from '../hooks/use-auth';
import type { AxiosError } from 'axios';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/utils/error-handler';
import { AUTH_ERROR_MAPPINGS } from '../api/errors';
import { logger } from '@/lib/utils/logger';
import { cn } from '@/lib/utils';

type Props = {
  initial?: LoginCredentials;
  onSuccess?: () => void;
};

export default function LoginForm({ initial, onSuccess }: Props) {
  const [identifier, setIdentifier] = useState(initial?.identifier ?? '');
  const [password, setPassword] = useState(initial?.password ?? '');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { login: contextLogin } = useAuth();

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    try {
      setLoading(true);
      const result = loginSchema.safeParse({ identifier, password });

      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.issues.forEach((issue) => {
          const path = issue.path[0] as string;
          if (!fieldErrors[path]) {
            fieldErrors[path] = issue.message;
          }
        });
        setErrors(fieldErrors);
        return;
      }

      const creds = result.data;

      // 1. Perform the login (cookie mode)
      await apiLogin(
        {
          email: creds.identifier,
          password: creds.password,
        },
        rememberMe, // useCookies
        !rememberMe, // useSessionCookies
      );

      // 2. Fetch user information to populate the context
      const { data: userInfo } = await getAuthenticatedUserInfo();

      // 3. Update global auth state
      contextLogin({
        id: userInfo.id,
        email: userInfo.email,
        firstName: userInfo.firstName,
        middleName: userInfo.middleName,
        lastName: userInfo.lastName,
        roles: userInfo.roles,
      });

      toast.success('Welcome back!', {
        description: `Logged in as ${userInfo.email}`,
      });

      onSuccess?.();
    } catch (err) {
      const message = getErrorMessage(err as AxiosError, AUTH_ERROR_MAPPINGS);
      toast.error(message);

      logger.error('Login error:', err);
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
          placeholder="type to sign in"
          aria-label="username or email"
          className={cn(
            'mt-1',
            errors.identifier && 'border-destructive focus-visible:ring-destructive',
          )}
        />
        {errors.identifier && (
          <p className="mt-1 text-xs font-medium text-destructive">{errors.identifier}</p>
        )}
      </div>

      <div>
        <Label
          htmlFor="password"
          title="Enter your account password"
          className="block cursor-pointer"
        >
          Password
        </Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="your password"
          aria-label="password"
          className={cn(
            'mt-1',
            errors.password && 'border-destructive focus-visible:ring-destructive',
          )}
        />
        {errors.password && (
          <p className="mt-1 text-xs font-medium text-destructive">{errors.password}</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="rememberMe"
          checked={rememberMe}
          onCheckedChange={(checked) => setRememberMe(checked as boolean)}
        />
        <div className="flex items-center gap-1.5 leading-none">
          <Label
            htmlFor="rememberMe"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            Remember me
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                render={<Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />}
              />
              <TooltipContent>
                <p className="max-w-xs text-xs">
                  If checked, your session will remain active even after closing the browser.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
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
