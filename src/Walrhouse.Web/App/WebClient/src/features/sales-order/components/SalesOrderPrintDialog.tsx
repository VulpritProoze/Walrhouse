import { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { type IncomingOrderDto } from '../../receive/types/incoming-order-dto';
import { SalesOrderPrintTemplate } from './SalesOrderPrintTemplate';
import { Printer } from 'lucide-react';
import { useItem } from '@/features/item/hooks/queries/use-item';

interface SalesOrderPrintDialogProps {
  order: IncomingOrderDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ItemName = ({ itemCode }: { itemCode: string }) => {
  const { data: item, isLoading } = useItem(itemCode);

  if (isLoading) return <span className="text-muted-foreground animate-pulse">Loading...</span>;
  return <span>{item?.itemName || itemCode}</span>;
};

export const SalesOrderPrintDialog = ({
  order,
  open,
  onOpenChange,
}: SalesOrderPrintDialogProps) => {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [amounts, setAmounts] = useState<Record<string, number>>({});
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (order) {
      const initialRates: Record<string, number> = {};
      const initialAmounts: Record<string, number> = {};
      order.orderLines.forEach((line, idx) => {
        const key = `${line.itemCode}-${idx}`;
        initialRates[key] = 1.0;
        initialAmounts[key] = line.orderedQty * 1.0;
      });
      setRates(initialRates);
      setAmounts(initialAmounts);
    }
  }, [order]);

  if (!order) return null;

  const handleRateChange = (key: string, qty: number, value: string) => {
    const rate = parseFloat(value) || 0;
    setRates((prev) => ({ ...prev, [key]: rate }));
    setAmounts((prev) => ({ ...prev, [key]: qty * rate }));
  };

  const handleAmountChange = (key: string, value: string) => {
    const amount = parseFloat(value) || 0;
    setAmounts((prev) => ({ ...prev, [key]: amount }));
  };

  const lines = order.orderLines.map((line, idx) => {
    const key = `${line.itemCode}-${idx}`;
    return {
      itemCode: line.itemCode,
      unitOfMeasure: line.unitOfMeasure,
      orderedQty: line.orderedQty,
      rate: rates[key] || 0,
      amount: amounts[key] || 0,
    };
  });

  const subtotal = lines.reduce((acc, line) => acc + line.amount, 0);
  const total = subtotal;
  const balanceDue = total;

  const handlePrint = () => {
    const printContent = document.getElementById('sales-order-print-template');
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write('<html><head><title>Print Sales Order</title>');

    // Copy all style tags from current document
    document.querySelectorAll('style').forEach((style) => {
      printWindow.document.write(style.outerHTML);
    });

    // Copy all link tags (for tailwind/css)
    document.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
      printWindow.document.write(link.outerHTML);
    });

    printWindow.document.write('</head><body>');
    printWindow.document.write(printContent.outerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();

    // Give it a moment to load styles
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Print Sales Order Preview</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 border p-4 rounded-lg bg-muted/30">
              <div>
                <Label className="text-xs uppercase text-muted-foreground">Customer</Label>
                <p className="font-semibold">{order.customerName}</p>
              </div>
              <div className="text-right">
                <Label className="text-xs uppercase text-muted-foreground">Order ID</Label>
                <p className="font-mono">#{order.id}</p>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="w-[100px]">Qty</TableHead>
                  <TableHead className="w-[120px]">Rate</TableHead>
                  <TableHead className="w-[120px]">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.orderLines.map((line, idx) => {
                  const key = `${line.itemCode}-${idx}`;
                  return (
                    <TableRow key={key}>
                      <TableCell>
                        <ItemName itemCode={line.itemCode} />
                        <div className="text-[10px] text-muted-foreground">{line.itemCode}</div>
                      </TableCell>
                      <TableCell>{line.orderedQty}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={rates[key] ?? 1.0}
                          onChange={(e) => handleRateChange(key, line.orderedQty, e.target.value)}
                          className="h-8"
                          step="0.01"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={amounts[key] ?? line.orderedQty}
                          onChange={(e) => handleAmountChange(key, e.target.value)}
                          className="h-8"
                          step="0.01"
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            <div className="flex justify-end border-t pt-4">
              <div className="w-48 space-y-2">
                <div className="flex justify-between font-medium">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" /> Proceed to Print
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hidden container for printing */}
      <div className="hidden">
        <div ref={printRef}>
          <SalesOrderPrintTemplate
            order={order}
            lines={lines}
            subtotal={subtotal}
            total={total}
            balanceDue={balanceDue}
            salesPerson="System Administrator"
          />
        </div>
      </div>
    </>
  );
};
