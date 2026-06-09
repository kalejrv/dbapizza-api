import { Query, Repository } from "@types";

export enum StatusOption {
  Pending = "Pending",
  Preparing = "Preparing",
  Done = "Done",
  OnTheWay = "On the way",
  Delivered = "Delivered",
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
