import jwt from "jsonwebtoken";
import config from "@config/config";
import { Payload } from "@types";

export const createToken = (payload: Payload): string => {
  const JWT_SECRET_KEY = config.jwt.secretKey as string;
  const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "2h" });

  return token;
};
