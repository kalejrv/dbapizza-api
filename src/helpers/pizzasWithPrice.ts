import { Pizza, PizzaWithPrice } from "@types";

export const pizzasWithPrice = (pizzas: Pizza[]): PizzaWithPrice[] => {
  return pizzas.map((pizza) => {
    const { flavor, size } = pizza;

    return {
      ...pizza.toObject(),
      price: flavor.price + size.price,
    };
  });
};
