import * as React from 'react';
import { cn } from '@/lib/utils';
import { type LucideIcon, Lock } from 'lucide-react';

interface OverlayBlockerProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  enabled?: boolean;
  className?: string;
}

export function OverlayBlocker({
  title = 'Feature locked',
  description = 'This module is currently unavailable or requires additional permissions.',
  icon: Icon = Lock,
  children,
  enabled = true,
  className,
}: OverlayBlockerProps) {
  if (!enabled) return <>{children}</>;

  return (
    <div className={cn('relative isolate', className)}>
      {/* The Content to be blurred */}
      <div className="pointer-events-none select-none blur-sm grayscale-[0.2] opacity-50 transition-all duration-300">
        {children}
      </div>

      {/* The Overlay (Backdrop + Popup) */}
      <div className="absolute inset-0 z-50 flex items-center justify-center p-6">
        {/* Subtle backdrop similar to DialogOverlay but restricted to this container */}
        <div className="absolute inset-0 bg-background/20 rounded-xl" />

        {/* The "Dialog" card */}
        <div className="relative z-10 grid w-full max-w-[280px] gap-4 rounded-xl bg-background p-6 text-center shadow-2xl ring-1 ring-foreground/10 animate-in fade-in zoom-in-95 duration-200">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
            <Icon className="size-6 text-muted-foreground" />
          </div>
          <div className="grid gap-1.5">
            <h3 className="text-lg font-semibold tracking-tight leading-none">{title}</h3>
            <p className="text-sm text-muted-foreground text-balance">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
