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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';

export const BatchMasterList = () => {
  const [batches, setBatches] = useState(() => [
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
  ]);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [active, setActive] = useState<any>(null);
  const [form, setForm] = useState({ id: '', itemCode: '', quantity: 0, receivedDate: '', status: '' });

  const openAdd = () => {
    setForm({ id: '', itemCode: '', quantity: 0, receivedDate: '', status: '' });
    setActive(null);
    setIsAddOpen(true);
  };

  const openEdit = (b: any) => {
    setForm({ id: b.id, itemCode: b.itemCode, quantity: b.quantity, receivedDate: b.receivedDate, status: b.status });
    setActive(b);
    setIsEditOpen(true);
  };

  const openDelete = (b: any) => {
    setActive(b);
    setIsDeleteOpen(true);
  };

  const handleAdd = () => {
    setBatches((s) => [form, ...s]);
    setIsAddOpen(false);
  };

  const handleUpdate = () => {
    setBatches((s) => s.map((x) => (x.id === active.id ? form : x)));
    setIsEditOpen(false);
  };

  const handleDelete = () => {
    setBatches((s) => s.filter((x) => x.id !== active.id));
    setIsDeleteOpen(false);
  };

  return (
    <Card className="border-none shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <h3 className="text-sm font-semibold">Batch Master</h3>
        <div className="flex items-center gap-2">
          <Button onClick={openAdd}>Add Batch</Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30">
            <TableHead>Batch ID</TableHead>
            <TableHead>Item Code</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Received Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {batches.map((batch: any) => (
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
              <TableCell>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => openEdit(batch)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => openDelete(batch)}>
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Batch</DialogTitle>
            <DialogDescription>Add a new batch. Keep fields minimal for fast entry.</DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <div>
              <Label>Batch Number</Label>
              <Input value={form.id} onChange={(e: any) => setForm({ ...form, id: e.target.value })} />
            </div>
            <div>
              <Label>Item Code</Label>
              <Input value={form.itemCode} onChange={(e: any) => setForm({ ...form, itemCode: e.target.value })} />
            </div>
            <div>
              <Label>Quantity</Label>
              <Input type="number" value={form.quantity} onChange={(e: any) => setForm({ ...form, quantity: Number(e.target.value) })} />
            </div>
            <div>
              <Label>Received Date</Label>
              <Input type="date" value={form.receivedDate} onChange={(e: any) => setForm({ ...form, receivedDate: e.target.value })} />
            </div>
            <div>
              <Label>Status</Label>
              <Input value={form.status} onChange={(e: any) => setForm({ ...form, status: e.target.value })} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Batch</DialogTitle>
            <DialogDescription>Update batch details. Changes are local only.</DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <div>
              <Label>Batch Number</Label>
              <Input value={form.id} onChange={(e: any) => setForm({ ...form, id: e.target.value })} disabled />
            </div>
            <div>
              <Label>Item Code</Label>
              <Input value={form.itemCode} onChange={(e: any) => setForm({ ...form, itemCode: e.target.value })} />
            </div>
            <div>
              <Label>Quantity</Label>
              <Input type="number" value={form.quantity} onChange={(e: any) => setForm({ ...form, quantity: Number(e.target.value) })} />
            </div>
            <div>
              <Label>Received Date</Label>
              <Input type="date" value={form.receivedDate} onChange={(e: any) => setForm({ ...form, receivedDate: e.target.value })} />
            </div>
            <div>
              <Label>Status</Label>
              <Input value={form.status} onChange={(e: any) => setForm({ ...form, status: e.target.value })} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdate}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Batch</DialogTitle>
            <DialogDescription>Delete batch {active?.id}</DialogDescription>
          </DialogHeader>

          <div className="py-4">Are you sure you want to delete batch <strong>{active?.id}</strong>?</div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
