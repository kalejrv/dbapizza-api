import { OrderItem } from "@types";

export interface NewOrderItem extends Pick<OrderItem, 'pizza' | 'selectedSize' | 'quantity'> {
  toppings?: string[];
};
