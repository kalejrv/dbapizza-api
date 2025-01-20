import { createUser, deleteUser, findUserById, findUsers, updateUser } from "@controllers";
import { checkUserPermissions, verifyUserAuth } from "@middlewares";
import { Router } from "express";

const router = Router();
const basePath: string = "/users";

export const userRoutes = () => {
  router.get(`${basePath}`, verifyUserAuth, checkUserPermissions, findUsers)
        .get(`${basePath}/:id`, verifyUserAuth, checkUserPermissions, findUserById);
  router.post(`${basePath}`, verifyUserAuth, checkUserPermissions, createUser);
  router.patch(`${basePath}/:id`, verifyUserAuth, checkUserPermissions, updateUser);
  router.delete(`${basePath}/:id`, verifyUserAuth, checkUserPermissions, deleteUser);
  
  return router;
};
