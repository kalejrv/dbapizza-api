import { PizzaRepository, SizeRepository, ToppingRepository } from "@repositories";
import { PizzaService, SizeService, ToppingService } from "@services";
import { IPizzaRepository, IPizzaService, ISizeRepository, ISizeService, IToppingRepository, IToppingService, OrderItem, Item, Pizza, Size, Topping } from "@types";
import { pizzaWithPrice } from "./pizzaWithPrice";

const pizzaRepository: IPizzaRepository = new PizzaRepository;
const pizzaService: IPizzaService = new PizzaService(pizzaRepository);

const toppingRepository: IToppingRepository = new ToppingRepository;
const toppingService: IToppingService = new ToppingService(toppingRepository);

const sizeRepository: ISizeRepository = new SizeRepository;
const sizeService: ISizeService = new SizeService(sizeRepository);

export const formatOrderItems = async (orderItems: Item[]): Promise<OrderItem[]> => {
  try {
    const formattedOrderItems = await Promise.all(
      orderItems.map(async (item: Item): Promise<OrderItem> => {
        /* Find pizza and size. */
        const pizzaExists = await pizzaService.findPizzaById(String(item.pizza)) as Pizza;
        const sizeExists = await sizeService.findSizeByName(item.size) as Size;

        /* Assign size selected by user to pizza and calculate its total price. */
        pizzaExists.size = sizeExists;
        const pizza = pizzaWithPrice(pizzaExists);

        /* Find toppings and calculate its total price. */
        let toppings: Topping[] = [];
        let toppingsTotalPrice: number = 0;
        if (item.toppings && (item.toppings.length > 0)) {
          const toppingsId = item.toppings.map(toppingId => toppingId);
          toppings = await toppingService.findToppings({ _id: { $in: toppingsId } });
          toppingsTotalPrice = toppings.reduce((prev: number, curr: Topping): number => prev += curr.price, 0);
        };
  
        /* Set item quantity and calculate its total price. */
        const quantity: number = item.quantity;
        let total: number = 0;
        (item.toppings && (item.toppings.length > 0))
          ? total = (pizza.price + toppingsTotalPrice) * quantity
          : total = pizza.price * quantity;
        
        return {
          pizza,
          toppingsDetail: {
            toppings,
            toppingsTotalPrice,
          },
          quantity,
          total,
        };
      }),
    );

    return formattedOrderItems;
  } catch (error: any) {
    throw new Error(`Error: ${error.message}`);
  };
};
