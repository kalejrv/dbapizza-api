import { Pizza } from "@types";

export const pizzasWithPrice = (pizzas: Pizza[]): Pizza[] => {
  return pizzas.map((pizza: Pizza): Pizza => {
    const { flavor, size } = pizza;

    return {
      ...pizza.toObject(),
      price: flavor.price + size.price,
    };
  });
};
