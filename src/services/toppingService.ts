import { IToppingRepository, IToppingService, Query, Topping } from "@types";

export class ToppingService implements IToppingService {
  private toppingRepository: IToppingRepository;

  constructor(toppingRepository: IToppingRepository) {
    this.toppingRepository = toppingRepository;
  };

  async createTopping(topping: Topping): Promise<Topping> {
    return this.toppingRepository.create(topping);
  };

  async findToppings(query?: Query): Promise<Topping[]> {
    return this.toppingRepository.find(query);
  };

  async findToppingById(id: string): Promise<Topping | null> {
    return this.toppingRepository.findById(id);
  };

  async findToppingByName(name: string): Promise<Topping | null> {
    return this.toppingRepository.findOne({ name });
  };

  async updateTopping(id: string, Topping: Partial<Topping>): Promise<Topping | null> {
    return this.toppingRepository.update(id, Topping);
  };

  async deleteTopping(id: string): Promise<boolean> {
    return this.toppingRepository.delete(id);
  };
};
