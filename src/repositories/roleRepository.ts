import { RoleModel } from '@models';
import { IRoleRepository, Role, Query } from '@types';

export class RoleRepository implements IRoleRepository {
  async create(data: Role): Promise<Role> {
    const newRole = new RoleModel(data);
    return await newRole.save();
  };

  async find(query?: Query): Promise<Role[]> {
    return await RoleModel.find(query || {}).exec();
  };

  async findById(id: string): Promise<Role | null> {
    return await RoleModel.findById(id).exec();
  };

  async findOne(query: Query): Promise<Role | null> {
    return await RoleModel.findOne(query).exec();
  };

  async update(id: string, data: Partial<Role>): Promise<Role | null> {
    return await RoleModel.findByIdAndUpdate(id, data, { new: true }).exec();
  };

  async delete(id: string): Promise<boolean> {
    const roleDeleted = await RoleModel.findByIdAndDelete(id).exec();
    return roleDeleted !== null;
  };
};
