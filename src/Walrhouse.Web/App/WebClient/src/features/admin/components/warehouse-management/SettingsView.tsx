import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { OverlayBlocker } from '@/components/ui/overlay-blocker';
import { Settings2 } from 'lucide-react';

export function SettingsView() {
  return (
    <OverlayBlocker
      title="Coming Soon"
      description="Warehouse management settings is currently under development. This module will allow fine-grained control over layout and automation."
      icon={Settings2}
    >
      <div className="space-y-6 animate-in fade-in duration-300">
        <div>
          <h4 className="text-lg font-medium">UI Settings</h4>
          <p className="text-sm text-muted-foreground">
            Adjust infrastructure display preferences.
          </p>
        </div>

        <Card className="p-6 border-none shadow-sm space-y-6">
          <div className="space-y-4">
            <h5 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Display Preferences
            </h5>
            <div className="flex items-start space-x-3 pointer-events-none opacity-80">
              <Checkbox id="show-empty" />
              <div className="grid gap-1.5 leading-none">
                <label htmlFor="show-empty" className="text-sm font-medium leading-none">
                  Show empty warehouses in main dashboard
                </label>
                <p className="text-xs text-muted-foreground">
                  Display facilities even if they currently have 0 stock recorded.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Checkbox id="confirm-move" defaultChecked />
              <div className="grid gap-1.5 leading-none">
                <label htmlFor="confirm-move" className="text-sm font-medium leading-none">
                  Require confirmation for bin deactivation
                </label>
                <p className="text-xs text-muted-foreground">
                  Adds an extra verification step before marking bins as unavailable.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button variant="outline" className="h-9">
              Restore Defaults
            </Button>
            <Button className="ml-2 h-9 shadow-sm">Save Changes</Button>
          </div>
        </Card>
      </div>
    </OverlayBlocker>
  );
}
