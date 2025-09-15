import { Router } from "express";
import { loginUser, signupUser } from "@controllers";

const router = Router();
const basePath: string = "/auth";

export const authRouter = (): Router => {
  router.post(`${basePath}/signup`, signupUser)
        .post(`${basePath}/login`, loginUser);

  return router;
};
