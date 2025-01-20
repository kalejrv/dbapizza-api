import { User } from "@types";
import jwt from "jsonwebtoken";

export const verifyToken = (token: string, key: string): User => {
  return jwt.verify(token, key) as User;
};
