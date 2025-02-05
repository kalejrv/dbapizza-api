import { createStatus, deleteStatus, findStatus, findStatusById, updateStatus } from "@controllers";
import { checkUserPermissions, verifyUserAuth } from "@middlewares";
import { Router } from "express";

const router = Router();
const basePath: string = "/status";

export const statusRoutes = () => {
  router.get(`${basePath}`, verifyUserAuth, checkUserPermissions, findStatus);
  router.get(`${basePath}/:id`, verifyUserAuth, checkUserPermissions, findStatusById);
  router.post(`${basePath}`, verifyUserAuth, checkUserPermissions, createStatus);
  router.patch(`${basePath}/:id`, verifyUserAuth, checkUserPermissions, updateStatus);
  router.delete(`${basePath}/:id`, verifyUserAuth, checkUserPermissions, deleteStatus);

  return router;
};
