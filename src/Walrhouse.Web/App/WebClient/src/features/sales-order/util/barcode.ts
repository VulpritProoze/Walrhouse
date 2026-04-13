/**
 * Generates the barcode value for a sales order ID.
 * @param orderId The numeric sales order ID.
 * @returns The prefixed barcode value.
 */
export const getSalesOrderBarcodeValue = (orderId: number | string): string => {
  if (!orderId) return '';
  return `SALES-ORDER-${orderId}`;
};

/**
 * Decodes a barcode value to extract the sales order ID.
 * @param barcodeValue The full barcode string.
 * @returns The extracted order ID (as string) or null if not a sales order barcode.
 */
export const decodeSalesOrderBarcode = (barcodeValue: string): string => {
  if (!barcodeValue) return '';
  if (barcodeValue.startsWith('SALES-ORDER-')) {
    return barcodeValue.replace('SALES-ORDER-', '');
  }
  return barcodeValue;
};
