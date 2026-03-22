import { useState } from 'react';
import { User, Settings, Keyboard, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/use-auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { toast } from 'sonner';

export function UserButton() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  return (
    <>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger
            render={(props: object) => (
              <DropdownMenuTrigger
                {...props}
                className="relative h-8 w-8 rounded-full ring-offset-background transition-all hover:ring-2 hover:ring-ring hover:ring-offset-2 outline-none cursor-pointer"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {user?.firstName && user?.lastName
                      ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
                      : 'UU'}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
            )}
          />
          <TooltipContent side="bottom" sideOffset={10} align="end">
            <p>Account settings</p>
          </TooltipContent>
        </Tooltip>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="font-normal px-2 py-1.5">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold leading-none">
                  {user?.firstName || user?.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : 'Guest'}
                </p>
                <p className="text-xs text-muted-foreground leading-none">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Your Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Keyboard className="mr-2 h-4 w-4" />
              <span>Keyboard shortcuts</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={async () => {
              setIsLoggingOut(true);
              await logout();
              navigate('/login');
              toast.success('Logged out successfully!');
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <LoadingScreen open={isLoggingOut} message="Signing out..." />
    </>
  );
}
