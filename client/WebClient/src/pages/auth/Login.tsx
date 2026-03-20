import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import LoginForm from '@/features/auth';
import type { LoginCredentials } from '@/features/auth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function Login() {
  const navigate = useNavigate();
  // define initial login credentials here (page-level payload definition)
  const initialCreds: LoginCredentials = { identifier: '', password: '' };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-background px-4">
      <Card
        className={cn(
          'w-full max-w-md bg-card/80 backdrop-blur-sm border border-transparent shadow-lg',
          'motion-safe:transition-colors motion-safe:duration-200',
        )}
        aria-live="polite"
      >
        <CardHeader>
          <div className="flex items-center gap-3 mb-3">
            <img
              src="/walrhouse2.png"
              alt="Walrhouse logo"
              className="h-10 w-10 rounded-md object-cover"
            />
          </div>
          <CardTitle className="text-2xl font-semibold">Walrhouse</CardTitle>
          <CardDescription>Strong, social, resilient — storage made simple.</CardDescription>
        </CardHeader>

        <CardContent>
          <LoginForm
            initial={initialCreds}
            onSuccess={() => {
              navigate('/');
            }}
          />
        </CardContent>
      </Card>

      <footer className="text-sm text-muted-foreground w-full max-w-md text-center">
        <div className="mb-2">Integrations: LDAP, SSO, Device scanners — connect in Settings.</div>
        <div className="text-xs">
          Walrhouse — named after walruses: built to endure, built to work together.
        </div>
      </footer>
    </div>
  );
}
