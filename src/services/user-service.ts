import { IUserRepository, IUserService, Query, User } from "@types";

export class UserService implements IUserService {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  };

  async createUser(user: User): Promise<User> {
    return this.userRepository.create(user);
  };

  async findUsers(query?: Query): Promise<User[]> {
    return this.userRepository.find(query);
  };

  async findUsersCount(query?: Query): Promise<number> {
    const count = this.userRepository.findCount?.(query);
    return count ?? 0;
  };

  async findUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  };

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ email });
  };

  async updateUser(id: string, user: Partial<User>): Promise<User | null> {
    return this.userRepository.update(id, user);
  };

  async deleteUser(id: string): Promise<boolean> {
    return this.userRepository.delete(id);
  };
};
