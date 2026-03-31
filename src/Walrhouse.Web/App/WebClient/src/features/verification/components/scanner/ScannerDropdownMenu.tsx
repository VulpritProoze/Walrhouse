import { RefreshCw, Volume, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

type Props = {
  audioBeep: boolean;
  setAudioBeep: (v: boolean) => void;
  refreshCamera: () => void;
};

export default function ScannerDropdownMenu({ audioBeep, setAudioBeep, refreshCamera }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="h-10 w-10 rounded-full bg-black/40 text-white hover:bg-black/60 border-none backdrop-blur-md"
          title="Scanner settings"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent side="bottom" align="start" className="w-64">
        <DropdownMenuItem onClick={refreshCamera} className="flex items-start gap-3 px-3 py-2">
          <RefreshCw className="h-4 w-4 mt-0.5 text-muted-foreground" />
          <div className="flex flex-col text-left">
            <span className="text-sm font-medium">Refresh camera</span>
            <span className="text-xs text-muted-foreground">
              Remount scanner and re-request camera permissions.
            </span>
          </div>
        </DropdownMenuItem>

        <div className="h-px bg-border my-1" />

        <div className="flex items-center justify-between gap-3 px-3 py-2">
          <div className="flex items-start gap-3">
            <Volume className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <div className="flex flex-col text-left">
              <span className="text-sm font-medium">Audio beep</span>
              <span className="text-xs text-muted-foreground">
                Play a short beep when a code is scanned.
              </span>
            </div>
          </div>
          <Switch checked={audioBeep} onCheckedChange={(v) => setAudioBeep(!!v)} />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
