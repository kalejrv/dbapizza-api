import { Document } from "mongoose";
import { Query, Repository } from "./repositoryTypes";
import { Role } from "./roleTypes";

export interface User extends Document {
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  email: string;
  password: string;
  role: Role;
  hashPassword(password: string): Promise<string>;
  comparePassword(password: string): Promise<boolean>;
};

export interface IUserRepository extends Repository<User> { };

export interface IUserService {
  createUser(user: User): Promise<User>;
  findUsers(query?: Query): Promise<User[]>;
  findUserById(id: string): Promise<User | null>;
  findUserByEmail(email: string): Promise<User | null>;
  updateUser(id: string, user: Partial<User>): Promise<User | null>;
  deleteUser(id: string): Promise<boolean>;
};
