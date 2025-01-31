import { Query, Repository } from "./repositoryTypes";

export enum SizeOption {
  Personal = "Personal",
  Medium = "Medium",
  Large = "Large",
};

export interface Size {
  _id: object,
  name: SizeOption,
  price: number,
};

export interface ISizeRepository extends Repository<Size> { };

export interface ISizeService {
  createSize(size: Size): Promise<Size>;
  findSizes(query?: Query): Promise<Size[]>;
  findSizeById(id: string): Promise<Size | null>;
  findSizeByName(name: string): Promise<Size | null>;
  updateSize(id: string, Size: Partial<Size>): Promise<Size | null>;
  deleteSize(id: string): Promise<boolean>;
};
