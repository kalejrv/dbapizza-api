import { IRoleRepository, IRoleService, Query, Role } from "@types";

export class RoleService implements IRoleService {
  private roleRepository: IRoleRepository;

  constructor(roleRepository: IRoleRepository) {
    this.roleRepository = roleRepository;
  };

  async createRole(role: Role): Promise<Role> {
    return this.roleRepository.create(role);
  };

  async findRoles(query?: Query): Promise<Role[]> {
    return this.roleRepository.find(query);
  };

  async findRoleById(id: string): Promise<Role | null> {
    return this.roleRepository.findById(id);
  };

  async findRoleByName(name: string): Promise<Role | null> {
    return this.roleRepository.findOne({ name });
  };

  async updateRole(id: string, Role: Partial<Role>): Promise<Role | null> {
    return this.roleRepository.update(id, Role);
  };

  async deleteRole(id: string): Promise<boolean> {
    return this.roleRepository.delete(id);
  };
};
