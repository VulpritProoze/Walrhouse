import { format, parseISO } from 'date-fns';
import { type IncomingOrderDto } from '../../receive/types/incoming-order-dto';
import { useItem } from '@/features/item/hooks/queries/use-item';
import { getBarcodeImageUrl } from '@/features/barcode/api/barcode.service';
import { getSalesOrderBarcodeValue } from '@/features/sales-order/util/barcode';

interface PrintLine {
  itemCode: string;
  unitOfMeasure: string;
  orderedQty: number;
  rate: number;
  amount: number;
}

interface SalesOrderPrintTemplateProps {
  order: IncomingOrderDto;
  lines: PrintLine[];
  subtotal: number;
  total: number;
  balanceDue: number;
  salesPerson: string;
}

const ItemDescription = ({ itemCode }: { itemCode: string }) => {
  const { data: item } = useItem(itemCode);
  return <span>{item?.itemName || itemCode}</span>;
};

export const SalesOrderPrintTemplate = ({
  order,
  lines,
  subtotal,
  total,
  balanceDue,
  salesPerson,
}: SalesOrderPrintTemplateProps) => {
  const barcodeValue = getSalesOrderBarcodeValue(order.id);
  const barcodeUrl = getBarcodeImageUrl(barcodeValue);

  return (
    <div className="p-8 bg-white text-black font-sans print:p-0" id="sales-order-print-template">
      <div className="flex justify-between items-start mb-8">
        <div>
          <img src={barcodeUrl} alt={barcodeValue} className="h-20 w-auto object-contain" />
          <p className="text-[8px] font-mono mt-1 text-center uppercase tracking-widest">
            {barcodeValue}
          </p>
        </div>
        <div className="text-right">
          <h1 className="text-4xl font-bold uppercase tracking-tight">Sale Order</h1>
          <p className="text-sm text-gray-500 mt-1"># SO-{order.id.toString().padStart(3, '0')}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-12">
        <div className="space-y-4">
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-semibold">Sale By</p>
            <p className="font-medium">Majesty Pharma</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-semibold">Sale To</p>
            <p className="font-medium text-lg">{order.customerName}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-[1fr_auto] gap-x-8 items-center border-b pb-1">
            <span className="text-[10px] text-gray-500 uppercase font-semibold">Issue Date</span>
            <span className="font-medium min-w-[120px] text-right">
              {order.dueDate ? format(parseISO(order.dueDate), 'MMM dd, yyyy') : '-'}
            </span>
          </div>
          <div className="grid grid-cols-[1fr_auto] gap-x-8 items-center border-b pb-1">
            <span className="text-[10px] text-gray-500 uppercase font-semibold">Due Date</span>
            <span className="font-medium min-w-[120px] text-right">
              {order.dueDate ? format(parseISO(order.dueDate), 'MMM dd, yyyy') : '-'}
            </span>
          </div>
          <div className="grid grid-cols-[1fr_auto] gap-x-8 items-center">
            <span className="text-[10px] text-gray-500 uppercase font-semibold">
              Purchase Order
            </span>
            <span className="font-medium min-w-[120px] text-right">1</span>
          </div>
          <div className="grid grid-cols-[1fr_auto] gap-x-8 items-center">
            <span className="text-[10px] text-gray-500 uppercase font-semibold">Sale Person</span>
            <span className="font-medium min-w-[120px] text-right">{salesPerson}</span>
          </div>
        </div>
      </div>

      <table className="w-full mb-12">
        <thead>
          <tr className="bg-[#b9d1e6] text-black">
            <th className="text-left py-2 px-4 text-xs uppercase font-semibold">
              Items / Description
            </th>
            <th className="text-center py-2 px-4 text-xs uppercase font-semibold">UoM</th>
            <th className="text-center py-2 px-4 text-xs uppercase font-semibold">Qty</th>
            <th className="text-center py-2 px-4 text-xs uppercase font-semibold">Rate</th>
            <th className="text-right py-2 px-4 text-xs uppercase font-semibold">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {lines.map((line, idx) => (
            <tr key={idx}>
              <td className="py-3 px-4">
                <ItemDescription itemCode={line.itemCode} />
              </td>
              <td className="py-3 px-4 text-center">{line.unitOfMeasure}</td>
              <td className="py-3 px-4 text-center">{line.orderedQty}</td>
              <td className="py-3 px-4 text-center">{line.rate.toFixed(2)}</td>
              <td className="py-3 px-4 text-right">
                {line.amount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end">
        <div className="w-1/3 space-y-3">
          <div className="flex justify-between items-baseline">
            <span className="font-bold text-sm">Subtotal</span>
            <span className="font-bold">
              $
              {subtotal.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className="flex justify-between items-baseline border-b-2 border-black pb-3">
            <span className="font-bold text-lg">Total</span>
            <span className="font-bold text-lg">
              $
              {total.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className="flex justify-between items-baseline pt-2">
            <span className="font-bold text-xl">Balance Due</span>
            <span className="font-bold text-xl">
              $
              {balanceDue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
      </div>

      <style type="text/css" media="print">
        {`
          @page { size: portrait; margin: 20mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          #sales-order-print-template { width: 100%; height: 100%; margin: 0; padding: 0; }
        `}
      </style>
    </div>
  );
};
