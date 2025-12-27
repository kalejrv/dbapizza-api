import { UserModel } from "@models";
import { IUserRepository, Query, User } from "@types";

export class UserRepository implements IUserRepository {
  async create(data: User): Promise<User> {
    const newUser = new UserModel(data);
    const savedUser = await newUser.save();

    return await savedUser.populate("role", "-createdAt -updatedAt");
  };

  async find(query?: Query): Promise<User[]> {
    return await UserModel
      .find(query || {})
      .select("-password -createdAt -updatedAt")
      .populate("role", "-createdAt -updatedAt")
      .exec();
  };

  async findCount(query?: Query): Promise<number> {
    return await UserModel.countDocuments(query);
  };

  async findById(id: string): Promise<User | null> {
    return await UserModel
      .findById(id)
      .select("-password -createdAt -updatedAt")
      .populate("role", "-_id -createdAt -updatedAt")
      .exec();
  };

  async findOne(query: Query): Promise<User | null> {
    return await UserModel
      .findOne(query)
      .populate("role")
      .exec();
  };

  async update(id: string, data: Partial<User>): Promise<User | null> {
    return await UserModel
      .findByIdAndUpdate(id, data, { new: true })
      .select("-password -createdAt -updatedAt")
      .populate("role", "-createdAt -updatedAt")
      .exec();
  };

  async delete(id: string): Promise<boolean> {
    const userDeleted = await UserModel.findByIdAndDelete(id).exec();
    return userDeleted !== null;
  };
};
