export const ItemGroup = {
  General: 1,
  Medicines: 2,
};

export type ItemGroup = (typeof ItemGroup)[keyof typeof ItemGroup];

export const BarcodeFormat = {
  GS1DataMatrix: 1,
  GS1_128: 2,
  QRCode: 3,
  Code39: 4,
};

export type BarcodeFormat = (typeof BarcodeFormat)[keyof typeof BarcodeFormat];
