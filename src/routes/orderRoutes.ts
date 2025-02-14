import { createOrder, deleteOrder, findOrderById, findOrders, updateOrder } from "@controllers";
import { checkUserPermissions, verifyUserAuth } from "@middlewares";
import { Router } from "express";

const router = Router();
const basePath: string = "/orders";

export const orderRoutes = () => {
  router.get(`${basePath}`, verifyUserAuth, checkUserPermissions, findOrders);
  router.get(`${basePath}/:id`, verifyUserAuth, checkUserPermissions, findOrderById);
  router.post(`${basePath}`, verifyUserAuth, checkUserPermissions, createOrder);
  router.patch(`${basePath}/:id`, verifyUserAuth, checkUserPermissions, updateOrder);
  router.delete(`${basePath}/:id`, verifyUserAuth, checkUserPermissions, deleteOrder);

  return router;
};
