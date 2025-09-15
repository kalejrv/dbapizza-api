import { OrderModel, PizzaModel, ToppingModel, UserModel } from "@models";
import { Order, Pizza, QueryModel, Topping, User } from "@types";

const findUsers = async (limit: number, skip: number): Promise<QueryModel<User>> => {
  const [totalModelItems, modelItems] = await Promise.all([
    UserModel.countDocuments(),
    UserModel
      .find({})
      .select("-password -createdAt -updatedAt")
      .populate("role", "-createdAt -updatedAt")
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
      .populate("flavor", "-createdAt -updatedAt")
      .populate("size", "-createdAt -updatedAt")
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
      .select("-createdAt -updatedAt")
      .populate("status", "-_id -createdAt -updatedAt")
      .populate("items.pizza", "-_id -createdAt -updatedAt")
      .populate("items.toppingsDetail.toppings", "-_id -createdAt -updatedAt")
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
