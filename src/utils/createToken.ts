import jwt from "jsonwebtoken";

export const createToken = (payload: object): string => {
  const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;
  const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "2h" });

  return token;
};
