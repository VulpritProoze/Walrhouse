import { NavLink } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Roles, RolePriority } from '@/features/auth/types/roles';

type Props = {
  title?: string;
  roles?: string[];
  logoSrc?: string;
};

export default function Header({
  title = 'Walrhouse',
  roles = [],
  logoSrc = '/walrhouse2.png',
}: Props) {
  // Identify the roles by priority
  const sortedRoles = [...roles].sort((a, b) => {
    const priorityA = RolePriority[a as Roles] ?? 0;
    const priorityB = RolePriority[b as Roles] ?? 0;
    return priorityB - priorityA;
  });

  const primaryRole = sortedRoles[0];
  const otherRoles = sortedRoles.slice(1);
  return (
    <div className="flex items-center gap-3">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="bg-transparent border-none p-0 outline-none">
            <NavLink to="/">
              <img src={logoSrc} alt="logo" className="h-8 w-8 rounded-sm object-cover" />
            </NavLink>
          </TooltipTrigger>
          <TooltipContent side="bottom" sideOffset={10} align="start">
            <p>Dashboard</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div className="flex flex-col gap-0.5">
        <div className="text-sm font-semibold leading-tight">{title}</div>
        {primaryRole && (
          <div className="flex items-center gap-1.5">
            <Badge
              variant="default"
              className="px-1.5 py-0 text-[10px] uppercase font-bold tracking-tight h-4"
            >
              {primaryRole}
            </Badge>

            {otherRoles.length > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="bg-transparent border-none p-0 outline-none cursor-help flex items-center">
                    <Badge
                      variant="outline"
                      className="px-1 py-0 text-[10px] font-bold h-4 text-muted-foreground hover:bg-muted"
                    >
                      +{otherRoles.length}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="text-xs">
                    <div className="flex flex-col gap-1 py-0.5">
                      <p className="font-semibold border-b pb-1 mb-1 opacity-70">
                        Additional Roles
                      </p>
                      {otherRoles.map((role) => (
                        <div key={role} className="flex items-center gap-1.5">
                          <div className="h-1 w-1 rounded-full bg-primary" />
                          {role}
                        </div>
                      ))}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
