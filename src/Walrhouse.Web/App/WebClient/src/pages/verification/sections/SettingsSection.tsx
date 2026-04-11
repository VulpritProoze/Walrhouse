import { useNavigate } from 'react-router-dom';
import { ScanSettings } from '@/features/verification';
import { Button } from '@/components/ui/button';

export default function SettingsSection() {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <ScanSettings />
      <div className="flex justify-end">
        <Button variant="outline" onClick={() => navigate('/verification')}>
          Back to Scanner
        </Button>
      </div>
    </div>
  );
}
