import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const BatchMasterList = () => {
  const mockBatches = [
    {
      id: 'BAT-001',
      itemCode: 'ITEM-A',
      quantity: 100,
      receivedDate: '2024-04-01',
      status: 'Pending',
    },
    {
      id: 'BAT-002',
      itemCode: 'ITEM-B',
      quantity: 50,
      receivedDate: '2024-04-02',
      status: 'Completed',
    },
  ];

  return (
    <Card className="border-none shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30">
            <TableHead>Batch ID</TableHead>
            <TableHead>Item Code</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Received Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockBatches.map((batch) => (
            <TableRow key={batch.id}>
              <TableCell className="font-mono font-bold">{batch.id}</TableCell>
              <TableCell>{batch.itemCode}</TableCell>
              <TableCell>{batch.quantity}</TableCell>
              <TableCell>{batch.receivedDate}</TableCell>
              <TableCell>
                <Badge variant={batch.status === 'Completed' ? 'success' : 'outline'}>
                  {batch.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};
