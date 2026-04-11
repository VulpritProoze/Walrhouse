import { useNavigate } from 'react-router-dom';
import { Scanner } from '@/features/verification';

export default function ScannerSection() {
  const navigate = useNavigate();

  const handleScan = (code: string) => {
    navigate(`/verification/details?code=${code}`);
  };

  return <Scanner onScan={handleScan} />;
}
