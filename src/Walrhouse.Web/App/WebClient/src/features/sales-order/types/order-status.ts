export const OrderStatus = {
  Open: 1,
  Closed: 2,
  Cancelled: 3,
};

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];
