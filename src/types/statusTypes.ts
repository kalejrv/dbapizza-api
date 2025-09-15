import { Query, Repository } from "./repositoryTypes";

export enum StatusOption {
  Pending = "Pending",
  InProgress = "In progress",
  Done = "Done",
  Cancelled = "Cancelled",
};

export interface Status {
  name: StatusOption;
  description: string;
};

export interface IStatusRepository extends Repository<Status> { };

export interface IStatusService {
  createStatus(status: Status): Promise<Status>;
  findStatus(query?: Query): Promise<Status[]>;
  findStatusById(id: string): Promise<Status | null>;
  findStatusByName(name: string): Promise<Status | null>;
  updateStatus(id: string, Status: Partial<Status>): Promise<Status | null>;
  deleteStatus(id: string): Promise<boolean>;
};
