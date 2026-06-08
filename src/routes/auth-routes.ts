import { Router } from "express";
import { signinUser, signupUser } from "@controllers";

const router = Router();
const basePath: string = "/auth";

export const authRouter = (): Router => {
  router.post(`${basePath}/signup`, signupUser)
        .post(`${basePath}/signin`, signinUser);

  return router;
};
