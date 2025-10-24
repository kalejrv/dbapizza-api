import { PizzaModel } from "@models";
import { IPizzaRepository, Pizza, Query } from "@types";

export class PizzaRepository implements IPizzaRepository {
  async create(data: Pizza): Promise<Pizza> {
    const newPizza = new PizzaModel(data);
    const savedPizza = await newPizza.save()
    
    await savedPizza.populate("flavor", "-_id -createdAt -updatedAt")
    await savedPizza.populate("size", "-_id -createdAt -updatedAt")
    
    return savedPizza;
  };

  async find(query?: Query): Promise<Pizza[]> {
    return await PizzaModel
      .find(query || {})
      .select("-createdAt -updatedAt")
      .populate("flavor", "-_id -createdAt -updatedAt")
      .populate("size", "-_id -createdAt -updatedAt")
      .exec();
    };
    
  async findById(id: string): Promise<Pizza | null> {
    return await PizzaModel
      .findById(id)
      .select("-createdAt -updatedAt")
      .populate("flavor", "-_id -createdAt -updatedAt")
      .populate("size", "-_id -createdAt -updatedAt")
      .exec();
  };

  async findOne(query: Query): Promise<Pizza | null> {
    return await PizzaModel
      .findOne(query)
      .populate("flavor")
      .populate("size")
      .exec();
  };
  
  async update(id: string, data: Partial<Pizza>): Promise<Pizza | null> {
    return await PizzaModel
      .findByIdAndUpdate(id, data, { new: true })
      .select("-createdAt -updatedAt")
      .populate("flavor", "-_id -createdAt -updatedAt")
      .populate("size", "-_id -createdAt -updatedAt")
      .exec();
  };

  async delete(id: string): Promise<boolean> {
    const pizzaDeleted = await PizzaModel.findByIdAndDelete(id);
    return pizzaDeleted !== null;
  };
};
