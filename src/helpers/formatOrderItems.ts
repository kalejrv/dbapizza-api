import { PizzaRepository, ToppingRepository } from "@repositories";
import { PizzaService, ToppingService } from "@services";
import { IPizzaRepository, IPizzaService, IToppingRepository, IToppingService, OrderItem, OrderItemFromBodyRequest, Pizza, Topping } from "@types";

const pizzaRepository: IPizzaRepository = new PizzaRepository;
const pizzaService: IPizzaService = new PizzaService(pizzaRepository);

const toppingRepository: IToppingRepository = new ToppingRepository;
const toppingService: IToppingService = new ToppingService(toppingRepository);

export const formatOrderItems = async (orderItems: OrderItemFromBodyRequest[]): Promise<OrderItem[]> => {
  try {
    const formattedOrderItems = await Promise.all(
      orderItems.map(async (item) => {
        /* Find pizza and calculate its total price. */
        const pizza = await pizzaService.findPizzaById(String(item.pizza)) as Pizza;
        const { flavor, size } = pizza;
        const pizzaTotalPrice: number = flavor.price + size.price;
        
        /* Find toppings and calculate its total price. */
        let toppings: Topping[] = [];
        let toppingsTotalPrice: number = 0;
        if (item.toppings!.length > 0) {
          const toppingsId = item.toppings?.map(toppingId => toppingId);
          toppings = await toppingService.findToppings({ _id: { $in: toppingsId } });
          toppingsTotalPrice = toppings?.reduce((prev, curr) => prev += curr.price, 0);
        };
  
        /* Calculate item total price */
        const pizzaQuantity: number = item.quantity;
        let itemTotalPrice: number = 0;
        (item.toppings!.length > 0)
          ? itemTotalPrice = (pizzaTotalPrice + toppingsTotalPrice) * pizzaQuantity
          : itemTotalPrice = pizzaTotalPrice * pizzaQuantity;

        /* Return order item formatted. */
        return {
          pizzaDetail: {
            pizza,
            pizzaTotalPrice,
          },
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
