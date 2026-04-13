/**
 * Generates the barcode value for a sales order ID.
 * @param orderId The numeric sales order ID.
 * @returns The prefixed barcode value.
 */
export const getSalesOrderBarcodeValue = (orderId: number | string): string => {
  if (!orderId) return '';
  return `SALES-ORDER-${orderId}`;
};
