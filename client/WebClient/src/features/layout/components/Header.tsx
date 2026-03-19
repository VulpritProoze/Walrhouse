import { NavLink } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type Props = {
  title?: string;
  roleLabel?: string;
  logoSrc?: string;
};

export default function Header({
  title = 'Walrhouse',
  roleLabel,
  logoSrc = '/walrhouse2.png',
}: Props) {
  return (
    <div className="flex items-center gap-3">
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
      <div className="flex flex-col">
        <div className="text-sm font-semibold">{title}</div>
        {roleLabel && <div className="text-xs text-muted-foreground">{roleLabel}</div>}
      </div>
    </div>
  );
}
