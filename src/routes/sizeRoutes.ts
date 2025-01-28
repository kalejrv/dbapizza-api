import { createSize, deleteSize, findSizeById, findSizes, updateSize } from "@controllers";
import { checkUserPermissions, verifyUserAuth } from "@middlewares";
import { Router } from "express";

const router = Router();
const basePath: string = "/sizes";

export const sizeRoutes = () => {
  router.get(`${basePath}`, verifyUserAuth, checkUserPermissions, findSizes);
  router.get(`${basePath}/:id`, verifyUserAuth, checkUserPermissions, findSizeById);
  router.post(`${basePath}`, verifyUserAuth, checkUserPermissions, createSize);
  router.patch(`${basePath}/:id`, verifyUserAuth, checkUserPermissions, updateSize);
  router.delete(`${basePath}/:id`, verifyUserAuth, checkUserPermissions, deleteSize);
  
  return router;
};
