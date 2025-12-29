import { Pagination, PaginationArgs, PaginationModel } from "@types";
import queryModel from "./queryModel";

export const pagination = async (paginationsArgs: PaginationArgs): Promise<Pagination> => {
  const { model, page, limit, skip } = paginationsArgs;
  
  try {
    let items: any[] = [];
    let totalItems: number = 0;
    
    switch (model) {
      case PaginationModel.Users:
        const { totalModelItems: totalUsers, modelItems: users } = await queryModel.findUsers(limit, skip);
        totalItems = totalUsers;
        items = users;
        break;
      case PaginationModel.Toppings:
        const { totalModelItems: totalToppings, modelItems: toppings } = await queryModel.findToppings(limit, skip);
        totalItems = totalToppings;
        items = toppings;
        break;
      case PaginationModel.Pizzas:
        const { totalModelItems: totalPizzas, modelItems: pizzas } = await queryModel.findPizzas(limit, skip);
        totalItems = totalPizzas;
        items = pizzas;
        break;
      case PaginationModel.Orders:
        const { totalModelItems: totalOrders, modelItems: orders } = await queryModel.findOrders(limit, skip);
        totalItems = totalOrders;
        items = orders;
        break;
      default: "No items found";
        break;
    };
    
    const totalPages: number = Math.ceil(totalItems / limit);
    const itemsByPage: number = (limit > totalItems) ? totalItems : limit;
    const currentPage: number = page;
    const currentItemsQuantity: number = ((limit * page) > totalItems) ? totalItems : limit * page;

    return {
      totalPages,
      totalItems,
      items,
      itemsByPage,
      currentPage,
      currentItemsQuantity,
    };
  } catch (error: any) {
    throw new Error("Error fetching paginated Items.");
  };
};
