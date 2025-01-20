import { loginUser, signupUser } from "@controllers";
import { Router } from "express";

const router = Router();
const basePath: string = "/auth";

export const authRouter = () => {
  router.post(`${basePath}/signup`, signupUser)
        .post(`${basePath}/login`, loginUser);

  return router;
};
