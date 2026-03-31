import { Settings2 } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

export default function ScanSettings() {
  const [autoConfirm, setAutoConfirm] = useState(false);
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Settings2 className="h-5 w-5 text-primary" />
          Scanning Settings
        </CardTitle>
        <CardDescription>Configure scanner behavior and feedback preferences.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Auto-confirm */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Auto-confirm after scan</Label>
          <p className="text-xs text-muted-foreground">
            When enabled, items matching the expected list will be automatically confirmed without
            manual review.
          </p>
          <Switch checked={autoConfirm} onCheckedChange={(v) => setAutoConfirm(!!v)} />
        </div>
        <Separator />
      </CardContent>
    </Card>
  );
}
