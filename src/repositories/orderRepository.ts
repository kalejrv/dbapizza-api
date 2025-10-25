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
      .select("-updatedAt")
      .populate({
        path: "items.pizza",
        select: "-createdAt -updatedAt",
        populate: [
          { path: "flavor", select: "-_id -createdAt -updatedAt" },
          { path: "size", select: "-_id -createdAt -updatedAt" },
        ],
      })
      .populate("items.selectedSize", "-_id -createdAt -updatedAt")
      .populate("items.extra.toppings", "-_id -createdAt -updatedAt")
      .populate("status", "-_id -createdAt -updatedAt")
      .exec();
  };
  
  async findCount(query?: Query): Promise<number> {
    return await OrderModel.countDocuments(query);
  };

  async findById(id: string): Promise<Order | null> {
    return await OrderModel
      .findById(id)
      .select("-updatedAt")
      .populate({
        path: "items.pizza",
        select: "-createdAt -updatedAt",
        populate: [
          { path: "flavor", select: "-_id -createdAt -updatedAt" },
          { path: "size", select: "-_id -createdAt -updatedAt" },
        ],
      })
      .populate("items.selectedSize", "-createdAt -updatedAt")
      .populate("items.extra.toppings", "-_id -createdAt -updatedAt")
      .populate("status", "-_id -createdAt -updatedAt")
      .exec();
  };

  async findOne(query: Query): Promise<Order | null> {
    return await OrderModel
      .findOne(query)
      .populate({
        path: "items.pizza",
        populate: [
          { path: "flavor" },
          { path: "size" },
        ],
      })
      .populate("items.selectedSize")
      .populate("items.extra.toppings")
      .populate("status")
      .exec();
  };
  
  async update(id: string, data: Partial<Order>): Promise<Order | null> {
    return await OrderModel
      .findByIdAndUpdate(id, data, { new: true })
      .select("-createdAt -updatedAt")
      .populate({
        path: "items.pizza",
        select: "-createdAt -updatedAt",
        populate: [
          { path: "flavor", select: "-_id -createdAt -updatedAt" },
          { path: "size", select: "-_id -createdAt -updatedAt" },
        ],
      })
      .populate("items.selectedSize", "-_id -createdAt -updatedAt")
      .populate("items.extra.toppings", "-_id -createdAt -updatedAt")
      .populate("status", "-_id -createdAt -updatedAt")
      .exec();
  };

  async delete(id: string): Promise<boolean> {
    const orderDeleted = await OrderModel.findByIdAndDelete(id);
    return orderDeleted !== null;
  };
};
