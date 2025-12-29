import { TokenPayload } from "@types";
import jwt from "jsonwebtoken";

export const verifyToken = (token: string, key: string): TokenPayload => {
  return jwt.verify(token, key) as TokenPayload;
};
