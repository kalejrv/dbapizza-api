import { Query, Repository } from "@types";

export interface Size {
  name: string;
  price: number;
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
