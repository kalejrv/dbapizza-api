import { Pizza, Query, Repository, Size, Status, User } from "@types";

/* User. */
export type OrderUser = Pick<User, "firstName" | "lastName" | "address" | "phone" | "email">;

/* Item. */
export type OrderItem = {
  pizza: Pizza | string;
  size: Size | string;
  extra?: {
    toppings: string[],
    total: number,
  };
  quantity: number;
  total: number;
};

/* Delivery. */
export enum DeliveryType {
  Delivery = "Delivery",
  PickUp = "PickUp",
};
export type OrderDelivery = {
  type: DeliveryType;
  estimatedTime: number;
};

/* Status history. */
export interface OrderStatusHistory extends Pick<Status, "name"> {
  timestamp: Date,
};

export type Order = {
  code: string;
  user: OrderUser;
  items: OrderItem[];
  delivery: OrderDelivery;
  status: Status | string;
  statusHistory: OrderStatusHistory[];
  notes?: string;
  total: number;
};

export interface IOrderRepository extends Repository<Order> { };

export interface IOrderService {
  createOrder(order: Order): Promise<Order>;
  findOrders(query?: Query): Promise<Order[]>;
  findOrdersCount(query?: Query): Promise<number>;
  findOrder(query: Query): Promise<Order | null>;
  findOrderById(id: string): Promise<Order | null>;
  updateOrder(id: string, Order: Partial<Order>): Promise<Order | null>;
  deleteOrder(id: string): Promise<boolean>;
};
