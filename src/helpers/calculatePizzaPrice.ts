import { PizzaDoc } from "@types";

export const calculatePizzaPrice = (pizza: PizzaDoc): PizzaDoc => {
  const { flavor, size } = pizza;
  
  return {
    ...pizza.toObject(),
    price: flavor.price + size.price,
  };
};
