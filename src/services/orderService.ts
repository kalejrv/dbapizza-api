import { IOrderRepository, IOrderService, Order, Query } from "@types";

export class OrderService implements IOrderService {
  private orderRepository: IOrderRepository;

  constructor(orderRepository: IOrderRepository) {
    this.orderRepository = orderRepository;
  };

  async createOrder(order: Order): Promise<Order> {
    return this.orderRepository.create(order);
  };

  async findOrders(query?: Query): Promise<Order[]> {
    return this.orderRepository.find(query);
  };
  
  async findOrdersCount(query?: Query): Promise<number> {
    const count = this.orderRepository.findCount?.(query);
    return count ?? 0;
  };

  async findOrder(query: Query): Promise<Order | null> {
    return this.orderRepository.findOne(query);
  };

  async findOrderById(id: string): Promise<Order | null> {
    return this.orderRepository.findById(id);
  };

  async updateOrder(id: string, Order: Partial<Order>): Promise<Order | null> {
    return this.orderRepository.update(id, Order);
  };

  async deleteOrder(id: string): Promise<boolean> {
    return this.orderRepository.delete(id);
  };
};
