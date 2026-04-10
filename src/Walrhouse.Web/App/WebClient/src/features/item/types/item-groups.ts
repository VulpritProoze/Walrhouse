export const ItemGroup = {
  General: 1,
  Medicines: 2,
};

export type ItemGroup = (typeof ItemGroup)[keyof typeof ItemGroup];
