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

const recentScans = [
  {
    id: 'scan-001',
    sku: 'WH-00123',
    name: 'Industrial Widget A',
    location: 'Aisle 3, Shelf B-12',
    date: '2026-03-19 14:32',
    status: 'Verified',
  },
  {
    id: 'scan-002',
    sku: 'WH-00456',
    name: 'Steel Bracket B',
    location: 'Aisle 1, Shelf A-04',
    date: '2026-03-19 13:15',
    status: 'Verified',
  },
  {
    id: 'scan-003',
    sku: 'WH-00789',
    name: 'Rubber Seal C',
    location: 'Aisle 5, Shelf D-08',
    date: '2026-03-18 16:44',
    status: 'Mismatch',
  },
  {
    id: 'scan-004',
    sku: 'WH-01011',
    name: 'Copper Fitting D',
    location: 'Aisle 2, Shelf C-01',
    date: '2026-03-18 09:21',
    status: 'Verified',
  },
];

export default function MainContent() {
  const navigate = useNavigate();

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
                  Location
                </TableHead>
                <TableHead className="text-xs font-medium uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Date
                  </span>
                </TableHead>
                <TableHead className="text-xs font-medium uppercase tracking-wider">
                  Status
                </TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentScans.map((scan) => (
                <TableRow key={scan.id}>
                  <TableCell className="font-mono text-xs font-medium">{scan.sku}</TableCell>
                  <TableCell className="text-sm">{scan.name}</TableCell>
                  <TableCell className="text-muted-foreground text-xs hidden md:table-cell">
                    {scan.location}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">{scan.date}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        scan.status === 'Verified'
                          ? 'bg-emerald-500/10 text-emerald-600'
                          : 'bg-amber-500/10 text-amber-600'
                      }`}
                    >
                      {scan.status}
                    </span>
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
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
