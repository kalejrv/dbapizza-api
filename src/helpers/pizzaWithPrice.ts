import { Pizza } from "@types";

export const pizzaWithPrice = (pizza: Pizza) => {
  const { flavor, size } = pizza;
  
  return {
    ...pizza.toObject(),
    price: flavor.price + size.price,
  };
};
