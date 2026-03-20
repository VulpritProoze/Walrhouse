import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { LoaderIcon } from 'lucide-react';

interface LoadingScreenProps {
  open: boolean;
  message?: string;
}

export function LoadingScreen({ open, message = 'Authenticating...' }: LoadingScreenProps) {
  return (
    <Dialog open={open}>
      <DialogContent
        className="flex flex-col items-center justify-center gap-6 py-10 outline-none sm:max-w-[280px] bg-transparent ring-0 border-0 shadow-none pointer-events-none"
        showCloseButton={false}
      >
        <div className="relative flex items-center justify-center pointer-events-auto">
          <LoaderIcon className="h-8 w-8 text-black animate-spin" strokeWidth={1.5} />
        </div>

        <div className="flex flex-col items-center gap-2 text-center pointer-events-auto">
          <DialogTitle className="text-xl font-medium tracking-wide uppercase text-black/90">
            {message}
          </DialogTitle>
          <DialogDescription className="text-sm text-black/50 animate-pulse tracking-tight font-light">
            Please wait a moment
          </DialogDescription>
        </div>
      </DialogContent>
    </Dialog>
  );
}
