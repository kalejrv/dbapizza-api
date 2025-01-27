import { createTopping, deleteTopping, findToppingById, findToppings, updateTopping } from "@controllers";
import { checkUserPermissions, verifyUserAuth } from "@middlewares";
import { Router } from "express";

const router = Router();
const basePath: string = "/toppings";

export const toppingRoutes = () => {
  router.get(`${basePath}`, verifyUserAuth, checkUserPermissions, findToppings);
  router.get(`${basePath}/:id`, verifyUserAuth, checkUserPermissions, findToppingById);
  router.post(`${basePath}`, verifyUserAuth, checkUserPermissions, createTopping);
  router.patch(`${basePath}/:id`, verifyUserAuth, checkUserPermissions, updateTopping);
  router.delete(`${basePath}/:id`, verifyUserAuth, checkUserPermissions, deleteTopping);

  return router;
};
