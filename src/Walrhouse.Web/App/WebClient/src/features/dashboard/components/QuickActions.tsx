import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  CommandDialog,
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Settings2,
  ScanLine,
  History,
  Package,
  Download,
  BarChart3,
  type LucideIcon,
} from 'lucide-react';

// All navigable links available to configure
type QuickLink = {
  key: string;
  label: string;
  href: string;
  icon: LucideIcon;
};

const allLinks: QuickLink[] = [
  { key: 'verification', label: 'Item Verification', href: '/verification', icon: ScanLine },
  { key: 'history', label: 'History', href: '/history', icon: History },
  { key: 'inventory', label: 'Inventory', href: '#', icon: Package },
  { key: 'receive', label: 'Receive', href: '#', icon: Download },
  { key: 'reports', label: 'Reports', href: '#', icon: BarChart3 },
];

const defaultKeys = ['verification', 'history'];

export default function QuickActions() {
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [enabledKeys, setEnabledKeys] = useState<string[]>(defaultKeys);
  const [pendingKeys, setPendingKeys] = useState<string[]>(defaultKeys);

  const visibleLinks = allLinks.filter((l) => enabledKeys.includes(l.key));

  const openSettings = () => {
    setPendingKeys([...enabledKeys]);
    setSettingsOpen(true);
  };

  const togglePendingKey = (key: string) => {
    setPendingKeys((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  const saveSettings = () => {
    setEnabledKeys(pendingKeys);
    setSettingsOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription className="mt-1">Frequently used shortcuts.</CardDescription>
          </div>
          <Tooltip>
            <TooltipTrigger className="bg-transparent border-none p-0 outline-none">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={openSettings}>
                <Settings2 className="h-4 w-4" />
                <span className="sr-only">Customize quick actions</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={10} align="end">
              <p>Customize shortcuts</p>
            </TooltipContent>
          </Tooltip>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            {visibleLinks.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-4">
                No shortcuts configured. Click the gear to add some.
              </p>
            )}
            {visibleLinks.map((link) => (
              <Button
                key={link.key}
                variant="ghost"
                className="w-full justify-start gap-2 h-9"
                onClick={() => navigate(link.href)}
              >
                <link.icon className="h-4 w-4 text-muted-foreground" />
                {link.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Settings command dialog */}
      <CommandDialog
        open={settingsOpen}
        onOpenChange={(open) => {
          if (!open) saveSettings();
          setSettingsOpen(open);
        }}
        title="Customize Quick Actions"
        description="Search and toggle navigation shortcuts."
      >
        <Command>
          <CommandInput placeholder="Search modules..." />
          <CommandList>
            <CommandEmpty>No matching modules found.</CommandEmpty>
            <CommandGroup heading="Available Modules">
              {allLinks.map((link) => {
                const checked = pendingKeys.includes(link.key);
                return (
                  <CommandItem
                    key={link.key}
                    onSelect={() => togglePendingKey(link.key)}
                    className="cursor-pointer"
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() => togglePendingKey(link.key)}
                      className="mr-2"
                    />
                    <link.icon className="h-4 w-4 text-muted-foreground mr-2" />
                    <span>{link.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
