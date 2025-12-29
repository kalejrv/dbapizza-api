import { OrderModel, PizzaModel, ToppingModel, UserModel } from "@models";
import { Order, Pizza, QueryModel, Topping, User } from "@types";

const findUsers = async (limit: number, skip: number): Promise<QueryModel<User>> => {
  const [totalModelItems, modelItems] = await Promise.all([
    UserModel.countDocuments(),
    UserModel
      .find({})
      .select("-password -createdAt -updatedAt")
      .populate("role", "-_id -createdAt -updatedAt")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec(),
  ]);
  
  return {
    totalModelItems,
    modelItems,
  };
};

const findToppings = async (limit: number, skip: number): Promise<QueryModel<Topping>> => {
  const [totalModelItems, modelItems] = await Promise.all([
    ToppingModel.countDocuments(),
    ToppingModel
      .find({})
      .select("-createdAt -updatedAt")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec(),
  ]);

  return {
    totalModelItems,
    modelItems,
  };
};

const findPizzas = async (limit: number, skip: number): Promise<QueryModel<Pizza>> => {
  const [totalModelItems, modelItems] = await Promise.all([
    PizzaModel.countDocuments(),
    PizzaModel
      .find({})
      .select("-createdAt -updatedAt")
      .populate("flavor", "-_id -createdAt -updatedAt")
      .populate("size", "-_id -createdAt -updatedAt")
      .skip(skip)
      .limit(limit)
      .sort({ size: -1 })
      .exec(),
  ]);
  
  return {
    totalModelItems,
    modelItems,
  };
};

const findOrders = async (limit: number, skip: number): Promise<QueryModel<Order>> => {
  const [totalModelItems, modelItems] = await Promise.all([
    OrderModel.countDocuments(),
    OrderModel
      .find({})
      .select("-updatedAt")
      .populate({
        path: "items.pizza",
        select: "-createdAt -updatedAt",
        populate: [
          { path: "flavor", select: "-createdAt -updatedAt" },
          { path: "size", select: "-createdAt -updatedAt" },
        ],
      })
      .populate("items.selectedSize", "-createdAt -updatedAt")
      .populate("items.extra.toppings", "-createdAt -updatedAt")
      .populate("status", "-createdAt -updatedAt")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec(),
  ]);

  return {
    totalModelItems,
    modelItems,
  };
};

const queryModel = {
  findUsers,
  findToppings,
  findPizzas,
  findOrders,
};

export default queryModel;
