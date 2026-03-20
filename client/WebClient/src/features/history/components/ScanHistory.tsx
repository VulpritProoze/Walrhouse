import { useState } from 'react';
import { History, Package, Calendar, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Scan } from '../types';
import { ScanDetailsDialog } from './ScanDetailsDialog';

import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Placeholder rows — updated with pharmacy details
const placeholderScans: Scan[] = [
  {
    id: 1,
    sku: 'PH-10023',
    name: 'Paracetamol 500mg (Panadol)',
    date: '2026-03-19 14:32',
    expirationDate: '2026-06-01',
    status: 'Verified',
    binLocation: 'Z1-A-1-1',
    scannedBy: 'John Doe',
    uom: 'BOT',
    qtyPerBox: 24,
    itemDimensions: { length: 15, width: 10, height: 8 },
    binDimensions: { length: 50, width: 40, height: 30 },
  },
  {
    id: 2,
    sku: 'PH-44056',
    name: 'Amoxicillin 250mg',
    date: '2026-03-19 13:15',
    expirationDate: '2026-03-15', // Expired
    status: 'Verified',
    binLocation: 'Z1-B-2-4',
    scannedBy: 'Jane Smith',
    uom: 'BOX',
    qtyPerBox: 12,
    itemDimensions: { length: 20, width: 15, height: 12 },
    binDimensions: { length: 60, width: 50, height: 40 },
  },
  {
    id: 3,
    sku: 'PH-70889',
    name: 'Metformin 500mg',
    date: '2026-03-18 16:44',
    expirationDate: '2026-12-31',
    status: 'Mismatch',
    binLocation: 'Z2-C-1-1',
    scannedBy: 'Mike Wilson',
    uom: 'BOT',
    qtyPerBox: 30,
    itemDimensions: { length: 14, width: 9, height: 7 },
    binDimensions: { length: 45, width: 35, height: 25 },
  },
  {
    id: 4,
    sku: 'PH-10511',
    name: 'Atorvastatin 20mg',
    date: '2026-03-18 09:21',
    expirationDate: '2026-02-10', // Expired
    status: 'Verified',
    binLocation: 'Z1-A-04',
    scannedBy: 'Jane Smith',
    uom: 'BOT',
    qtyPerBox: 20,
    itemDimensions: { length: 16, width: 11, height: 9 },
    binDimensions: { length: 55, width: 45, height: 35 },
  },
  {
    id: 5,
    sku: 'PH-12213',
    name: 'Amlodipine 5mg',
    date: '2026-03-17 11:05',
    expirationDate: '2027-01-01',
    status: 'Verified',
    binLocation: 'Z1-A-02',
    scannedBy: 'John Doe',
    uom: 'BOX',
    qtyPerBox: 10,
    itemDimensions: { length: 18, width: 13, height: 11 },
    binDimensions: { length: 60, width: 50, height: 40 },
  },
];

export default function ScanHistory() {
  const [selectedScan, setSelectedScan] = useState<Scan | null>(null);

  const isExpired = (dateString: string) => {
    return new Date(dateString) < new Date();
  };
  return (
    <TooltipProvider>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <History className="h-5 w-5 text-primary" />
            Scan History
          </CardTitle>
          <CardDescription>Items you have scanned and verified in the warehouse.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="w-[140px] text-xs font-medium uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <Package className="h-3 w-3" /> SKU
                    </span>
                  </TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wider">
                    Item Name
                  </TableHead>
                  <TableHead className="w-[180px] text-xs font-medium uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Scan Date
                    </span>
                  </TableHead>
                  <TableHead className="w-[120px] text-xs font-medium uppercase tracking-wider">
                    Expiration
                  </TableHead>
                  <TableHead className="w-[120px] text-xs font-medium uppercase tracking-wider">
                    Status
                  </TableHead>
                  <TableHead className="w-[80px] text-xs font-medium uppercase tracking-wider">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {placeholderScans.map((scan) => {
                  const expired = isExpired(scan.expirationDate);
                  return (
                    <TableRow key={scan.id} className={expired ? 'bg-destructive/5' : ''}>
                      <TableCell className="font-mono text-xs font-medium">{scan.sku}</TableCell>
                      <TableCell
                        className={`text-sm ${expired ? 'text-destructive font-medium' : ''}`}
                      >
                        {scan.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">{scan.date}</TableCell>
                      <TableCell
                        className={`text-xs font-medium ${
                          expired ? 'text-destructive' : 'text-muted-foreground'
                        }`}
                      >
                        {scan.expirationDate}
                      </TableCell>
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
                      <TableCell className="text-right">
                        <Tooltip>
                          <TooltipTrigger
                            className={cn(
                              buttonVariants({ variant: 'ghost', size: 'icon' }),
                              'h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer',
                            )}
                            onClick={() => setSelectedScan(scan)}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View Details</span>
                          </TooltipTrigger>
                          <TooltipContent className="pointer-events-none" side="bottom" align="end">
                            <p>View Details</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <ScanDetailsDialog
            scan={selectedScan}
            onOpenChange={(open) => !open && setSelectedScan(null)}
          />
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
