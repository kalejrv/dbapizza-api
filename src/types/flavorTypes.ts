import { Query, Repository } from "./repositoryTypes";

export interface Flavor {
  _id: object,
  name: string;
  description: string;
  price: number;
};

export interface IFlavorRepository extends Repository<Flavor> { };

export interface IFlavorService {
  createFlavor(flavor: Flavor): Promise<Flavor>;
  findFlavors(query?: Query): Promise<Flavor[]>;
  findFlavorById(id: string): Promise<Flavor | null>;
  findFlavorByName(name: string): Promise<Flavor | null>;
  updateFlavor(id: string, Flavor: Partial<Flavor>): Promise<Flavor | null>;
  deleteFlavor(id: string): Promise<boolean>;
};
