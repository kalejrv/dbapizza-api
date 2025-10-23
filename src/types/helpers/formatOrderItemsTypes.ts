import { OrderItem } from "@types";

export interface NewOrderItem extends Pick<OrderItem, 'pizza' | 'size' | 'quantity'> {
  toppings?: string[];
};
