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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { type BatchDto } from '../types/batch-dto';
import { BatchStatus } from '@/features/batch/types';
import { useState } from 'react';
import { AddBatchDialog, UpdateBatchDialog } from './batch-management/BatchDialogs';

type BatchForm = BatchDto;

export const BatchMasterList = () => {
  const [batches, setBatches] = useState<BatchDto[]>(() => [
    {
      batchNumber: 'BAT-001',
      itemCode: 'ITEM-A',
      expiryDate: '2025-04-01',
      status: 1,
      binNo: 'BIN-01',
    },
    {
      batchNumber: 'BAT-002',
      itemCode: 'ITEM-B',
      expiryDate: '2025-04-02',
      status: 1,
      binNo: 'BIN-02',
    },
  ]);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [active, setActive] = useState<BatchDto | null>(null);
  const [form, setForm] = useState<BatchForm>({
    batchNumber: '',
    itemCode: '',
    expiryDate: '',
    status: 0,
    binNo: '',
  });

  const openAdd = () => {
    setForm({ batchNumber: '', itemCode: '', expiryDate: '', status: 0, binNo: '' });
    setActive(null);
    setIsAddOpen(true);
  };

  const openEdit = (b: BatchDto) => {
    setForm({
      batchNumber: b.batchNumber,
      itemCode: b.itemCode,
      expiryDate: b.expiryDate,
      status: b.status,
      binNo: b.binNo,
    });
    setActive(b);
    setIsEditOpen(true);
  };

  const openDelete = (b: BatchDto) => {
    setActive(b);
    setIsDeleteOpen(true);
  };

  const handleAdd = () => {
    setBatches((s) => [form, ...s]);
    setIsAddOpen(false);
  };

  const handleUpdate = () => {
    if (!active) return;
    setBatches((s) => s.map((x) => (x.batchNumber === active.batchNumber ? form : x)));
    setIsEditOpen(false);
  };

  const handleDelete = () => {
    if (!active) return;
    setBatches((s) => s.filter((x) => x.batchNumber !== active.batchNumber));
    setIsDeleteOpen(false);
  };

  const getStatusLabel = (status: number) => {
    switch (status) {
      case BatchStatus.Released:
        return 'Released';
      case BatchStatus.Locked:
        return 'Locked';
      case BatchStatus.Restricted:
        return 'Restricted';
      default:
        return 'Pending';
    }
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
            <TableHead>Bin No</TableHead>
            <TableHead>Expiry Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {batches.map((batch: BatchDto) => (
            <TableRow key={batch.batchNumber}>
              <TableCell className="font-mono font-bold">{batch.batchNumber}</TableCell>
              <TableCell>{batch.itemCode}</TableCell>
              <TableCell>{batch.binNo}</TableCell>
              <TableCell>{batch.expiryDate}</TableCell>
              <TableCell>
                <Badge variant={batch.status === BatchStatus.Released ? 'success' : 'outline'}>
                  {getStatusLabel(batch.status)}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => openEdit(batch)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => openDelete(batch)}>
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Add Dialog */}
      <AddBatchDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        form={form}
        onFormChange={setForm}
        onSubmit={handleAdd}
      />

      {/* Edit Dialog */}
      <UpdateBatchDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        form={form}
        onFormChange={setForm}
        onSubmit={handleUpdate}
      />

      {/* Delete Confirm Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Batch</DialogTitle>
            <DialogDescription>Delete batch {active?.batchNumber}</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            Are you sure you want to delete batch <strong>{active?.batchNumber}</strong>?
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
