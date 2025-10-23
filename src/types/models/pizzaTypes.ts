import { Flavor, Query, Repository, Size } from "@types";

export interface Pizza {
  flavor: Flavor;
  size: Size;
  image: string;
  price: number;
};

export interface IPizzaRepository extends Repository<Pizza> { };

export interface IPizzaService {
  createPizza(pizza: Pizza): Promise<Pizza>;
  findPizzas(query?: Query): Promise<Pizza[]>;
  findPizza(query: Query): Promise<Pizza | null>;
  findPizzaById(id: string): Promise<Pizza | null>;
  updatePizza(id: string, Pizza: Partial<Pizza>): Promise<Pizza | null>;
  deletePizza(id: string): Promise<boolean>;
};
