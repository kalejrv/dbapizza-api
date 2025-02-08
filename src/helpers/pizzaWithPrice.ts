import { Pizza, PizzaWithPrice } from "@types";

export const pizzaWithPrice = (pizza: Pizza): PizzaWithPrice => {
  const { flavor, size } = pizza;
  
  return {
    ...pizza.toObject(),
    price: flavor.price + size.price,
  };
};
