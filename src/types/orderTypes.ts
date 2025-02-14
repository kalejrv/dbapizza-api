import { Pizza } from "./pizzaTypes";
import { Query, Repository } from "./repositoryTypes";
import { Status } from "./statusTypes";
import { Topping } from "./toppingTypes";
import { User } from "./userTypes";

export type OrderUser = Pick<User, "firstName" | "lastName" | "address" | "phone" | "email">;
export type OrderStatus = Status;
export type OrderTotal = number;

export type PizzaDetail = {
  pizza: Pizza,
  pizzaTotalPrice: number,
};

export type ToppingsDetail = {
  toppings: Topping[],
  toppingsTotalPrice: number,
};

export interface OrderItem {
  pizzaDetail: PizzaDetail;
  toppingsDetail?: ToppingsDetail;
  quantity: number,
  total: number,
};

export interface Order {
  user: OrderUser;
  items: OrderItem[];
  status: OrderStatus;
  total: OrderTotal;
};

export interface OrderItemFromBodyRequest {
  pizza: Pizza;
  toppings?: Topping[];
  quantity: number;
};

export interface IOrderRepository extends Repository<Order> { };

export interface IOrderService {
  createOrder(order: Order): Promise<Order>;
  findOrders(query?: Query): Promise<Order[]>;
  findOrder(query: Query): Promise<Order | null>;
  findOrderById(id: string): Promise<Order | null>;
  updateOrder(id: string, Order: Partial<Order>): Promise<Order | null>;
  deleteOrder(id: string): Promise<boolean>;
};
