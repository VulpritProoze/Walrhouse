import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import CommonLayout from '@/layouts/CommonLayout';
import type { Roles as RoleType } from '@/features/auth/types/roles';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Settings2 } from 'lucide-react';
import { VerificationProvider } from '@/features/verification/context/VerificationContext';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export default function VerificationPage() {
  const { user } = useAuth();
  const roles = (user?.roles as RoleType[]) ?? [];
  const location = useLocation();
  const navigate = useNavigate();

  const isSettings = location.pathname.endsWith('/settings');

  return (
    <VerificationProvider>
      <CommonLayout roles={roles}>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Item Verification</h2>
              <p className="text-sm text-muted-foreground">
                Scan barcodes to verify inventory items.
              </p>
            </div>
            {!isSettings && (
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate('/verification/settings')}
                      className="bg-transparent border-none p-0 outline-none"
                    />
                  }
                >
                  <Settings2 className="h-4 w-4" />
                  <span className="sr-only">Scanning settings</span>
                </TooltipTrigger>
                <TooltipContent side="bottom" sideOffset={10} align="end">
                  <p>Scanning settings</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>

          <div className="max-w-2xl mx-auto w-full">
            <Outlet />
          </div>
        </div>
      </CommonLayout>
    </VerificationProvider>
  );
}
