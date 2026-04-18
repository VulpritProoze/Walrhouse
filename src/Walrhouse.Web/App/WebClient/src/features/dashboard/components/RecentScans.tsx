import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Package, Calendar, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const recentScans = [
  {
    id: 'scan-001',
    sku: 'PH-10023',
    name: 'Paracetamol 500mg',
    binLocation: 'Z1-A-1-1',
    date: '2026-03-19 14:32',
    expirationDate: '2026-06-01',
    status: 'Verified',
  },
  {
    id: 'scan-002',
    sku: 'PH-44056',
    name: 'Amoxicillin 250mg',
    binLocation: 'Z1-B-2-4',
    date: '2026-03-19 13:15',
    expirationDate: '2026-03-15', // Expired
    status: 'Verified',
  },
  {
    id: 'scan-003',
    sku: 'PH-70889',
    name: 'Metformin 500mg',
    binLocation: 'Z2-C-1-1',
    date: '2026-03-18 16:44',
    expirationDate: '2026-12-31',
    status: 'Mismatch',
  },
  {
    id: 'scan-004',
    sku: 'PH-10511',
    name: 'Atorvastatin 20mg',
    binLocation: 'Z1-A-04',
    date: '2026-03-18 09:21',
    expirationDate: '2026-02-10', // Expired
    status: 'Verified',
  },
];

export default function RecentScans() {
  const navigate = useNavigate();

  const isExpired = (dateString: string) => {
    return new Date(dateString) < new Date();
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-lg">Recent Scans</CardTitle>
        <CardDescription>Your latest item verifications at a glance.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="text-xs font-medium uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <Package className="h-3 w-3" /> SKU
                  </span>
                </TableHead>
                <TableHead className="text-xs font-medium uppercase tracking-wider">
                  Item Name
                </TableHead>
                <TableHead className="text-xs font-medium uppercase tracking-wider hidden md:table-cell">
                  Bin Location
                </TableHead>
                <TableHead className="text-xs font-medium uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Scan Date
                  </span>
                </TableHead>
                <TableHead className="text-xs font-medium uppercase tracking-wider">
                  Status
                </TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentScans.map((scan) => {
                const expired = isExpired(scan.expirationDate);
                return (
                  <TableRow key={scan.id} className={expired ? 'bg-destructive/5' : ''}>
                    <TableCell className="font-mono text-xs font-medium">{scan.sku}</TableCell>
                    <TableCell
                      className={`text-sm ${expired ? 'text-destructive font-medium' : ''}`}
                    >
                      {scan.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs hidden md:table-cell">
                      {scan.binLocation}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">{scan.date}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          expired
                            ? 'destructive'
                            : scan.status === 'Verified'
                              ? 'success'
                              : 'warning'
                        }
                      >
                        {expired ? 'Expired' : scan.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => navigate(`/verification`)}
                      >
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="sr-only">View scan detail</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
