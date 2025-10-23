import { Document } from "mongoose";
import { Flavor, Pizza, Size, Status, Topping } from "@types";

export type StatusDoc = Status & Document;
export type PizzaDoc = Pizza & Document;
export type ToppingDoc = Topping & Document;
export type FlavorDoc = Flavor & Document;
export type SizeDoc = Size & Document;
