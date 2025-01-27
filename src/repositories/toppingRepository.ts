import { ToppingModel } from "@models";
import { IToppingRepository, Query, Topping } from "@types";

export class ToppingRepository implements IToppingRepository {
  async create(data: Topping): Promise<Topping> {
    const newTopping = new ToppingModel(data);
    return await newTopping.save();
  };

  async find(query?: Query): Promise<Topping[]> {
    return await ToppingModel
      .find(query || {})
      .select("-createdAt -updatedAt")
      .exec();
    };
    
    async findById(id: string): Promise<Topping | null> {
      return await ToppingModel
      .findById(id)
      .select("-createdAt -updatedAt")
      .exec();
    };

  async findOne(query: Query): Promise<Topping | null> {
    return await ToppingModel
    .findOne(query)
    .exec();
  };
  
  async update(id: string, data: Partial<Topping>): Promise<Topping | null> {
    return await ToppingModel
      .findByIdAndUpdate(id, data, { new: true })
      .select("-createdAt -updatedAt")
      .exec();
  };

  async delete(id: string): Promise<boolean> {
    const toppingDeleted = await ToppingModel.findByIdAndDelete(id);
    return toppingDeleted !== null;
  };
};
