import { IPizzaRepository, IPizzaService, Pizza, Query } from "@types";

export class PizzaService implements IPizzaService {
  private pizzaRepository: IPizzaRepository;

  constructor(pizzaRepository: IPizzaRepository) {
    this.pizzaRepository = pizzaRepository;
  };

  async createPizza(pizza: Pizza): Promise<Pizza> {
    return this.pizzaRepository.create(pizza);
  };

  async findPizzas(query?: Query): Promise<Pizza[]> {
    return this.pizzaRepository.find(query);
  };
  
  async findPizza(query: Query): Promise<Pizza | null> {
    return this.pizzaRepository.findOne(query);
  };

  async findPizzaById(id: string): Promise<Pizza | null> {
    return this.pizzaRepository.findById(id);
  };

  async updatePizza(id: string, Pizza: Partial<Pizza>): Promise<Pizza | null> {
    return this.pizzaRepository.update(id, Pizza);
  };

  async deletePizza(id: string): Promise<boolean> {
    return this.pizzaRepository.delete(id);
  };
};
