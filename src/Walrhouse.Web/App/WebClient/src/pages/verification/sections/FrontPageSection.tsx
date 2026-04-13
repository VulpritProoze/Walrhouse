import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileSearch, Scan } from 'lucide-react';

export default function FrontPageSection() {
  const navigate = useNavigate();

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card
        className="cursor-pointer hover:border-primary/50 transition-colors"
        onClick={() => navigate('/verification/sales-order')}
      >
        <CardHeader>
          <div className="mb-2 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <FileSearch className="w-5 h-5 text-primary" />
          </div>
          <CardTitle>Sales Order</CardTitle>
          <CardDescription>Verify items against a specific Sales Order barcode.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full">
            Select
          </Button>
        </CardContent>
      </Card>

      <Card
        className="cursor-pointer hover:border-primary/50 transition-colors"
        onClick={() => navigate('/verification/scan')}
      >
        <CardHeader>
          <div className="mb-2 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Scan className="w-5 h-5 text-primary" />
          </div>
          <CardTitle>Direct Scan</CardTitle>
          <CardDescription>
            Immediately start scanning items to verify their details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full">
            Select
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
