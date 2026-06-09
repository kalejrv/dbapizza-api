import { StatusModel } from '@models';
import { Query, IStatusRepository, Status } from '@types';

export class StatusRepository implements IStatusRepository {
  async create(data: Status): Promise<Status> {
    const newStatus = new StatusModel(data);
    return await newStatus.save();
  };

  async find(query?: Query): Promise<Status[]> {
    return await StatusModel
      .find(query || {})
      .exec();
  };

  async findById(id: string): Promise<Status | null> {
    return await StatusModel
      .findById(id)
      .exec();
  };

  async findOne(query: Query): Promise<Status | null> {
    return await StatusModel
      .findOne(query)
      .select("-createdAt -updatedAt")
      .exec();
  };

  async update(id: string, data: Partial<Status>): Promise<Status | null> {
    return await StatusModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
  };

  async delete(id: string): Promise<boolean> {
    const statusDeleted = await StatusModel
      .findByIdAndDelete(id)
      .exec();
    
    return statusDeleted !== null;
  };
};
