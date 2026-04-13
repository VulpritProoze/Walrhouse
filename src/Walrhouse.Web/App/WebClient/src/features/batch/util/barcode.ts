/**
 * Generates the barcode value for a batch number.
 * @param batchNumber The raw batch number.
 * @returns The prefixed barcode value.
 */
export const getBatchBarcodeValue = (batchNumber: string): string => {
  if (!batchNumber) return '';
  return `BATCH-${batchNumber}`;
};
