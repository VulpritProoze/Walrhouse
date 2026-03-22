import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import type { NavItem } from '@/features/layout/constants/nav';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  items?: NavItem[];
};

export default function Nav({ items = [] }: Props) {
  const navigate = useNavigate();

  return (
    <nav className="flex items-center gap-2">
      {items.map((it) => (
        <Tooltip key={it.key}>
          <TooltipTrigger 
            className={cn(buttonVariants({ variant: it.variant ?? 'ghost', size: 'icon' }), "cursor-pointer")}
            onClick={() => it.href && navigate(it.href)}
          >
            <Link to={it.href ?? '#'} className="flex items-center justify-center w-full h-full">
              {it.icon ? <it.icon className="h-4 w-4" /> : it.label}
              <span className="sr-only">{it.label}</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="bottom" sideOffset={10}>
            <p>{it.label}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </nav>
  );
}
