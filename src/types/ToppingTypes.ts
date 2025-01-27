import { Query, Repository } from "./repositoryTypes";

export interface Topping {
  name: string,
  price: number,
};

export interface IToppingRepository extends Repository<Topping> { };

export interface IToppingService {
  createTopping(topping: Topping): Promise<Topping>;
  findToppings(query?: Query): Promise<Topping[]>;
  findToppingById(id: string): Promise<Topping | null>;
  findToppingByName(name: string): Promise<Topping | null>;
  updateTopping(id: string, Topping: Partial<Topping>): Promise<Topping | null>;
  deleteTopping(id: string): Promise<boolean>;
};
