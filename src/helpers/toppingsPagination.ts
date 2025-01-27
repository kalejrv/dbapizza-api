import { ToppingModel } from "@models";

export const toppingsPagination = async (skip: number, limit: number) => {
  try {
    const totalToppings = await ToppingModel.countDocuments();
    const totalPages = Math.ceil(totalToppings / limit);
    const toppings = await ToppingModel
      .find({})
      .select("-createdAt -updatedAt")
      .skip(skip)
      .limit(limit)
      .sort({ price: 1 })
      .exec();
    

    return {
      totalPages,
      totalToppings,
      toppings,
    };
  } catch (error: any) {
    throw new Error("Error fetching paginated Toppings.");
  };
};
