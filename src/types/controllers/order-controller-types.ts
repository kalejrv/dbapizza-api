import { DeliveryType, NewOrderItem, OptionalType, Order } from "@types";

/* createOrder(). */
export interface NewOrder extends Pick<Order, "notes"> {
  items: NewOrderItem[];
  deliveryType: DeliveryType;
};

/* updateOrder(). */
interface Updates extends Pick<Order, "notes" | "status"> {
  deliveryType: DeliveryType;
};
export type OrderUpdates = OptionalType<Updates>;
