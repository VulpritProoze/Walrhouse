export interface Scan {
  id: number;
  sku: string;
  name: string;
  date: string;
  expirationDate: string;
  status: string;
  binLocation: string;
  scannedBy: string;
  uom: string;
  qtyPerBox: number;
  itemDimensions: {
    length: number;
    width: number;
    height: number;
  };
  binDimensions: {
    length: number;
    width: number;
    height: number;
  };
}
