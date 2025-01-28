import { SizeModel } from "@models";
import { ISizeRepository, Query, Size } from "@types";

export class SizeRepository implements ISizeRepository {
  async create(data: Size): Promise<Size> {
    const newSize = new SizeModel(data);
    return await newSize.save();
  };

  async find(query?: Query): Promise<Size[]> {
    return await SizeModel
      .find(query || {})
      .select("-createdAt -updatedAt")
      .exec();
    };
    
  async findById(id: string): Promise<Size | null> {
    return await SizeModel
    .findById(id)
    .select("-createdAt -updatedAt")
    .exec();
  };

  async findOne(query: Query): Promise<Size | null> {
    return await SizeModel
    .findOne(query)
    .exec();
  };
  
  async update(id: string, data: Partial<Size>): Promise<Size | null> {
    return await SizeModel
      .findByIdAndUpdate(id, data, { new: true })
      .select("-createdAt -updatedAt")
      .exec();
  };

  async delete(id: string): Promise<boolean> {
    const sizeDeleted = await SizeModel.findByIdAndDelete(id);
    return sizeDeleted !== null;
  };
};
