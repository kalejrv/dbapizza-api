import { FlavorModel } from "@models";
import { Flavor, IFlavorRepository, Query } from "@types";

export class FlavorRepository implements IFlavorRepository {
  async create(data: Flavor): Promise<Flavor> {
    const newFlavor = new FlavorModel(data);
    return await newFlavor.save();
  };

  async find(query?: Query): Promise<Flavor[]> {
    return await FlavorModel
      .find(query || {})
      .select("-createdAt -updatedAt")
      .exec();
    };
    
    async findById(id: string): Promise<Flavor | null> {
      return await FlavorModel
      .findById(id)
      .select("-createdAt -updatedAt")
      .exec();
    };

  async findOne(query: Query): Promise<Flavor | null> {
    return await FlavorModel
    .findOne(query)
    .exec();
  };
  
  async update(id: string, data: Partial<Flavor>): Promise<Flavor | null> {
    return await FlavorModel
      .findByIdAndUpdate(id, data, { new: true })
      .select("-createdAt -updatedAt")
      .exec();
  };

  async delete(id: string): Promise<boolean> {
    const flavorDeleted = await FlavorModel.findByIdAndDelete(id);
    return flavorDeleted !== null;
  };
};
