import { Flavor, PizzaDoc, Size, SizeDoc } from "@types";

export const calculatePizzaPrice = (pizza: PizzaDoc, size: SizeDoc): PizzaDoc => {
  return {
    ...pizza.toObject(),
    price: (pizza.flavor as Flavor).price + (size as Size).price,
  };
};
