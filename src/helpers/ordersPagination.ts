import { OrderModel } from "@models";
import { PaginationData } from "@types";

export const ordersPagination = async (paginationData: PaginationData) => {
  const { limit, page, skip } = paginationData;

  try {
    const totalOrders: number = await OrderModel.countDocuments();
    const totalPages: number = Math.ceil(totalOrders / limit);
    const ordersByPage: number = (limit > totalOrders) ? totalOrders : limit;
    const currentPage: number = page;
    const currentOrdersQuantity: number = ((limit * page) > totalOrders) ? totalOrders : limit * page;
    const orders = await OrderModel
      .find({})
      .select("-createdAt -updatedAt")
      .populate("status", "-_id -createdAt -updatedAt")
      .populate("items.pizza", "-_id -createdAt -updatedAt")
      .populate("items.toppingsDetail.toppings", "-_id -createdAt -updatedAt")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();
    
    return {
      orders,
      totalOrders,
      ordersByPage,
      currentOrdersQuantity,
      currentPage,
      totalPages,
    };
  } catch (error: any) {
    throw new Error("Error fetching paginated Orders.");
  };
};
