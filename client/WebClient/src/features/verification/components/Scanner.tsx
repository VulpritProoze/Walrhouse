import { ScanLine } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type ScannerProps = {
  onScan?: (code: string) => void;
};

export default function Scanner({ onScan }: ScannerProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ScanLine className="h-5 w-5 text-primary" />
          Barcode Scanner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Placeholder: camera / scanner feed will go here */}
        <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/30 h-48">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <ScanLine className="h-10 w-10" />
            <p className="text-sm font-medium">Camera feed placeholder</p>
            <p className="text-xs">Barcode scanner will appear here</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Or type barcode manually…"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onScan?.((e.target as HTMLInputElement).value);
                (e.target as HTMLInputElement).value = '';
              }
            }}
          />
          <Button variant="default" size="default">
            Verify
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
