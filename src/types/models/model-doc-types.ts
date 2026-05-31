import { Document } from "mongoose";
import { Flavor, Pizza, Role, Size, Status, Topping, User } from "@types";

export type StatusDoc = Status & Document;
export type PizzaDoc = Pizza & Document;
export type ToppingDoc = Topping & Document;
export type FlavorDoc = Flavor & Document;
export type SizeDoc = Size & Document;
export type UserDoc = User & Document;
export type RoleDoc = Role & Document;
