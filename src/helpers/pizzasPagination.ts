import { PizzaModel } from "@models";
import { PaginationData } from "@types";

export const pizzasPagination = async (paginationData: PaginationData) => {
  const { skip, limit, page } = paginationData;

  try {
    const totalPizzas: number = await PizzaModel.countDocuments();
    const totalPages: number = Math.ceil(totalPizzas / limit);
    const pizzasByPage: number = (limit > totalPizzas) ? totalPizzas : limit;
    const currentPage: number = page;
    const currentPizzasQuantity: number = ((limit * page) > totalPizzas) ? totalPizzas : limit * page;
    const pizzas = await PizzaModel
      .find({})
      .select("-createdAt -updatedAt")
      .populate("flavor", "-createdAt -updatedAt")
      .populate("size", "-createdAt -updatedAt")
      .skip(skip)
      .limit(limit)
      .sort({ size: -1 })
      .exec();
    
    return {
      totalPages,
      totalPizzas,
      pizzas,
      pizzasByPage,
      currentPage,
      currentPizzasQuantity,
    };
  } catch (error: any) {
    throw new Error("Error fetching paginated Pizzas.");
  };
};
