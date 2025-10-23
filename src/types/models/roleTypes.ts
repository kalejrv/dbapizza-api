import { Query, Repository } from "@types";

export interface Role {
  name: string;
  permissions: string[];
};

export interface IRoleRepository extends Repository<Role> { };

export interface IRoleService {
  createRole(role: Role): Promise<Role>;
  findRoles(query?: Query): Promise<Role[]>;
  findRoleById(id: string): Promise<Role | null>;
  findRoleByName(name: string): Promise<Role | null>;
  updateRole(id: string, Role: Partial<Role>): Promise<Role | null>;
  deleteRole(id: string): Promise<boolean>;
};
