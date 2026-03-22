import { Settings2, Volume2, Vibrate, Camera } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export default function ScanSettings() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Settings2 className="h-5 w-5 text-primary" />
          Scanning Settings
        </CardTitle>
        <CardDescription>
          Configure scanner behavior and feedback preferences.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Camera selection placeholder */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Camera className="h-4 w-4 text-muted-foreground" />
            Camera Source
          </Label>
          <div className="flex h-10 items-center rounded-md border bg-muted/30 px-3 text-sm text-muted-foreground">
            Default camera — placeholder select
          </div>
        </div>

        <Separator />

        {/* Sound on scan */}
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            Sound on scan
          </Label>
          <div className="h-5 w-9 rounded-full bg-primary/80" title="Toggle placeholder" />
        </div>

        {/* Vibration on scan */}
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Vibrate className="h-4 w-4 text-muted-foreground" />
            Vibrate on scan
          </Label>
          <div className="h-5 w-9 rounded-full bg-muted" title="Toggle placeholder" />
        </div>

        <Separator />

        {/* Auto-confirm */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Auto-confirm after scan</Label>
          <p className="text-xs text-muted-foreground">
            When enabled, items matching the expected list will be automatically confirmed without manual review.
          </p>
          <div className="h-5 w-9 rounded-full bg-muted" title="Toggle placeholder" />
        </div>
      </CardContent>
    </Card>
  );
}
