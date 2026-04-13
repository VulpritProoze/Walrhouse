/**
 * Generates the barcode value for a batch number.
 * @param batchNumber The raw batch number.
 * @returns The prefixed barcode value.
 */
export const getBatchBarcodeValue = (batchNumber: string): string => {
  if (!batchNumber) return '';
  return `BATCH-${batchNumber}`;
};

/**
 * Decodes a barcode value to extract the batch number.
 * @param barcodeValue The full barcode string.
 * @returns The extracted batch number or null if not a batch barcode.
 */
export const decodeBatchBarcode = (barcodeValue: string): string => {
  if (!barcodeValue) return '';
  if (barcodeValue.startsWith('BATCH-')) {
    return barcodeValue.replace('BATCH-', '');
  }
  return barcodeValue;
};
