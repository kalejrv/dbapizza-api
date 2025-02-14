import { OrderItem } from '@types';

export const calculateTotalOrder = (orderItems: OrderItem[]): number => {
  return orderItems.reduce((prev, curr) => prev += curr.total, 0);
};
