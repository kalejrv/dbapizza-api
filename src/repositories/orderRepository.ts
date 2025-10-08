import { OrderModel } from "@models";
import { IOrderRepository, Order, Query } from "@types";

export class OrderRepository implements IOrderRepository {
  async create(data: Order): Promise<Order> {
    const newOrder = new OrderModel(data);
    return await newOrder.save();
  };

  async find(query?: Query): Promise<Order[]> {
    return await OrderModel
      .find(query || {})
      .select("-createdAt -updatedAt")
      .populate("status", "-_id -createdAt -updatedAt")
      .populate("items.pizza", "-_id -createdAt -updatedAt")
      .populate("items.toppingsDetail.toppings", "-_id -createdAt -updatedAt")
      .exec();
    };
  
  async findCount(query?: Query): Promise<number> {
    return await OrderModel.countDocuments(query);
  };

  async findById(id: string): Promise<Order | null> {
    return await OrderModel
      .findById(id)
      .select("-createdAt -updatedAt")
      .populate("status", "-_id -createdAt -updatedAt")
      .populate("items.pizza", "-_id -createdAt -updatedAt")
      .populate("items.toppingsDetail.toppings", "-_id -createdAt -updatedAt")
      .exec();
  };

  async findOne(query: Query): Promise<Order | null> {
    return await OrderModel
      .findOne(query)
      .populate("status")
      .populate("items.pizza")
      .populate("items.toppingsDetail.toppings")
      .exec();
  };
  
  async update(id: string, data: Partial<Order>): Promise<Order | null> {
    return await OrderModel
      .findByIdAndUpdate(id, data, { new: true })
      .select("-createdAt -updatedAt")
      .populate("status", "-_id -createdAt -updatedAt")
      .populate("items.pizza", "-_id -createdAt -updatedAt")
      .populate("items.toppingsDetail.toppings", "-_id -createdAt -updatedAt")
      .exec();
  };

  async delete(id: string): Promise<boolean> {
    const orderDeleted = await OrderModel.findByIdAndDelete(id);
    return orderDeleted !== null;
  };
};
