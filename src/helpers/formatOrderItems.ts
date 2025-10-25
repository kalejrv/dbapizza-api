import { PizzaRepository, SizeRepository, ToppingRepository } from "@repositories";
import { PizzaService, SizeService, ToppingService } from "@services";
import { IPizzaRepository, IPizzaService, ISizeRepository, ISizeService, IToppingRepository, IToppingService, OrderItem, NewOrderItem, PizzaDoc, Topping, ToppingDoc, SizeDoc } from "@types";
import { calculatePizzaPrice } from "./calculatePizzaPrice";

const pizzaRepository: IPizzaRepository = new PizzaRepository;
const pizzaService: IPizzaService = new PizzaService(pizzaRepository);

const toppingRepository: IToppingRepository = new ToppingRepository;
const toppingService: IToppingService = new ToppingService(toppingRepository);

const sizeRepository: ISizeRepository = new SizeRepository;
const sizeService: ISizeService = new SizeService(sizeRepository);

export const formatOrderItems = async (items: NewOrderItem[]): Promise<OrderItem[]> => {
  try {
    const formattedOrderItems = await Promise.all(
      items.map(async (item: NewOrderItem): Promise<OrderItem> => {
        /* Find pizza and size. */
        const [pizzaExists, sizeExists] = await Promise.all([
          pizzaService.findPizzaById(item.pizza as string),
          sizeService.findSizeById(item.selectedSize as string),
        ]);
        
        /* Validate if pizza or size don't exists. */
        if (!pizzaExists || !sizeExists) throw new Error(`Pizza or Size were not found.`);
        
        /* Calculate pizza total price. */
        const size = sizeExists as SizeDoc;
        const pizza = calculatePizzaPrice(pizzaExists as PizzaDoc, size);

        /* Find toppings and calculate its total price. */
        let toppings: string[] = [];
        let toppingsFinded: ToppingDoc[] = [];
        let toppingsTotalPrice: number = 0;
        if (item.toppings && (item.toppings.length > 0)) {
          const toppingsId = item.toppings.map(toppingId => toppingId);
          toppingsFinded = await toppingService.findToppings({ _id: { $in: toppingsId } }) as ToppingDoc[];
          toppingsTotalPrice = toppingsFinded.reduce((prev: number, curr: Topping): number => prev += curr.price, 0);
          toppings = toppingsFinded.map(topping => topping._id as string);
        };

        /* Set item quantity and calculate its total price. */
        const quantity = item.quantity;
        let total: number = 0;
        (item.toppings && (item.toppings.length > 0))
          ? total = (pizza.price + toppingsTotalPrice) * quantity
          : total = pizza.price * quantity;
        
        return {
          pizza: pizza._id as string,
          selectedSize: size._id as string,
          extra: {
            toppings,
            total: toppingsTotalPrice,
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
