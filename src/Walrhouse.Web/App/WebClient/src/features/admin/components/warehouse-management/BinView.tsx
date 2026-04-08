import { Plus, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';

export function BinView() {
  const bins = [
    { id: 'b1', name: 'A-01-01', type: 'Pallet Rack', warehouse: 'W-MAIN', capacity: '1000kg' },
    { id: 'b2', name: 'A-01-02', type: 'Pallet Rack', warehouse: 'W-MAIN', capacity: '1000kg' },
    { id: 'b3', name: 'B-01-01', type: 'Small Parts', warehouse: 'W-MAIN', capacity: '50kg' },
    { id: 'b4', name: 'S-01-01', type: 'Cold Storage', warehouse: 'W-SOUTH', capacity: '500kg' },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-lg font-medium">Bin Locations</h4>
          <p className="text-sm text-muted-foreground">Manage specific storage slots and racks.</p>
        </div>
        <Button size="sm" className="gap-2" variant="outline">
          <Plus className="h-4 w-4" />
          Add Bins (Bulk)
        </Button>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead>Bin ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Warehouse</TableHead>
              <TableHead>Max Capacity</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bins.map((b) => (
              <TableRow key={b.id} className="hover:bg-muted/10 group cursor-default">
                <TableCell className="font-mono text-sm font-semibold">{b.name}</TableCell>
                <TableCell className="text-sm">{b.type}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{b.warehouse}</TableCell>
                <TableCell className="text-sm">{b.capacity}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
