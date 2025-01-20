import { createUser, deleteUser, findUserById, findUsers, updateUser } from "@controllers";
import { Router } from "express";

const router = Router();
const basePath: string = "/users";

export const userRoutes = () => {
  router.get(`${basePath}`, findUsers)
        .get(`${basePath}/:id`, findUserById);
  router.post(`${basePath}`, createUser);
  router.patch(`${basePath}/:id`, updateUser);
  router.delete(`${basePath}/:id`, deleteUser);
  
  return router;
};
