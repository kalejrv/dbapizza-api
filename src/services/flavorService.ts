import { Flavor, IFlavorRepository, IFlavorService, Query } from "@types";

export class FlavorService implements IFlavorService {
  private flavorRepository: IFlavorRepository;

  constructor(flavorRepository: IFlavorRepository) {
    this.flavorRepository = flavorRepository;
  };

  async createFlavor(flavor: Flavor): Promise<Flavor> {
    return this.flavorRepository.create(flavor);
  };

  async findFlavors(query?: Query): Promise<Flavor[]> {
    return this.flavorRepository.find(query);
  };

  async findFlavorById(id: string): Promise<Flavor | null> {
    return this.flavorRepository.findById(id);
  };

  async findFlavorByName(name: string): Promise<Flavor | null> {
    return this.flavorRepository.findOne({ name });
  };

  async updateFlavor(id: string, Flavor: Partial<Flavor>): Promise<Flavor | null> {
    return this.flavorRepository.update(id, Flavor);
  };

  async deleteFlavor(id: string): Promise<boolean> {
    return this.flavorRepository.delete(id);
  };
};
