import { PizzaRepository, SizeRepository, ToppingRepository } from "@repositories";
import { PizzaService, SizeService, ToppingService } from "@services";
import { IPizzaRepository, IPizzaService, ISizeRepository, ISizeService, IToppingRepository, IToppingService, OrderItem, OrderItemFromRequest, Pizza, Size, Topping } from "@types";
import { pizzaWithPrice } from "./pizzaWithPrice";

const pizzaRepository: IPizzaRepository = new PizzaRepository;
const pizzaService: IPizzaService = new PizzaService(pizzaRepository);

const toppingRepository: IToppingRepository = new ToppingRepository;
const toppingService: IToppingService = new ToppingService(toppingRepository);

const sizeRepository: ISizeRepository = new SizeRepository;
const sizeService: ISizeService = new SizeService(sizeRepository);

export const formatOrderItems = async (orderItems: OrderItemFromRequest[]): Promise<OrderItem[]> => {
  try {
    const formattedOrderItems = await Promise.all(
      orderItems.map(async (item) => {
        /* Find pizza, assign size selected by user and calculate its total price. */
        const pizzaExists = await pizzaService.findPizzaById(String(item.pizza)) as Pizza;
        const newPizzaSize = await sizeService.findSizeByName(item.size) as Size;
        pizzaExists.size = newPizzaSize;
        const pizza = pizzaWithPrice(pizzaExists);

        /* Find toppings and calculate its total price. */
        let toppings: Topping[] = [];
        let toppingsTotalPrice: number = 0;
        if (item.toppings && (item.toppings.length > 0)) {
          const toppingsId = item.toppings.map(toppingId => toppingId);
          toppings = await toppingService.findToppings({ _id: { $in: toppingsId } });
          toppingsTotalPrice = toppings.reduce((prev, curr) => prev += curr.price, 0);
        };
  
        /* Calculate item total price */
        const pizzaQuantity: number = item.quantity;
        let itemTotalPrice: number = 0;
        (item.toppings && (item.toppings.length > 0))
          ? itemTotalPrice = (pizza.price + toppingsTotalPrice) * pizzaQuantity
          : itemTotalPrice = pizza.price * pizzaQuantity;

        /* Return order item formatted. */
        return {
          pizza,
          toppingsDetail: {
            toppings,
            toppingsTotalPrice,
          },
          quantity: pizzaQuantity,
          total: itemTotalPrice,
        };
      }),
    );

    return formattedOrderItems;
  } catch (error: any) {
    throw new Error(`Error: ${error.message}`);
  };
};
