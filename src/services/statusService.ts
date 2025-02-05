import { IStatusRepository, IStatusService, Query, Status } from "@types";

export class StatusService implements IStatusService {
  private statusRepository: IStatusRepository;

  constructor(statusRepository: IStatusRepository) {
    this.statusRepository = statusRepository;
  };

  async createStatus(status: Status): Promise<Status> {
    return this.statusRepository.create(status);
  };

  async findStatus(query?: Query): Promise<Status[]> {
    return this.statusRepository.find(query);
  };

  async findStatusById(id: string): Promise<Status | null> {
    return this.statusRepository.findById(id);
  };

  async findStatusByName(name: string): Promise<Status | null> {
    return this.statusRepository.findOne({ name });
  };

  async updateStatus(id: string, Status: Partial<Status>): Promise<Status | null> {
    return this.statusRepository.update(id, Status);
  };

  async deleteStatus(id: string): Promise<boolean> {
    return this.statusRepository.delete(id);
  };
};
