import { OrderItem } from '@types';

export const calculateTotalOrder = (orderItems: OrderItem[]): number => {
  return orderItems.reduce((prev: number, curr: OrderItem): number => {
    return prev += curr.total;
  }, 0);
};
