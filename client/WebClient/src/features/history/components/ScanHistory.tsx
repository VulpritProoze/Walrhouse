import { History, Package, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Placeholder rows — will be replaced with real API data + table component later
const placeholderScans = [
  {
    id: 1,
    sku: 'WH-00123',
    name: 'Industrial Widget A',
    date: '2026-03-19 14:32',
    status: 'Verified',
  },
  { id: 2, sku: 'WH-00456', name: 'Steel Bracket B', date: '2026-03-19 13:15', status: 'Verified' },
  { id: 3, sku: 'WH-00789', name: 'Rubber Seal C', date: '2026-03-18 16:44', status: 'Mismatch' },
  {
    id: 4,
    sku: 'WH-01011',
    name: 'Copper Fitting D',
    date: '2026-03-18 09:21',
    status: 'Verified',
  },
  { id: 5, sku: 'WH-01213', name: 'Plastic Cap E', date: '2026-03-17 11:05', status: 'Verified' },
];

export default function ScanHistory() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <History className="h-5 w-5 text-primary" />
          Scan History
        </CardTitle>
        <CardDescription>Items you have scanned and verified.</CardDescription>
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
                    <Calendar className="h-3 w-3" /> Date
                  </span>
                </TableHead>
                <TableHead className="w-[120px] text-xs font-medium uppercase tracking-wider">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {placeholderScans.map((scan) => (
                <TableRow key={scan.id}>
                  <TableCell className="font-mono text-xs font-medium">{scan.sku}</TableCell>
                  <TableCell className="text-sm">{scan.name}</TableCell>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
