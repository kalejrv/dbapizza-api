import { createRole, deleteRole, findRoleById, findRoles, updateRole } from "@controllers";
import { checkUserPermissions, verifyUserAuth } from "@middlewares";
import { Router } from "express";

const router = Router();
const basePath: string = "/roles";

export const roleRoutes = () => {
  router.get(`${basePath}`, verifyUserAuth, checkUserPermissions, findRoles)
        .get(`${basePath}/:id`, verifyUserAuth, checkUserPermissions, findRoleById);
  router.post(`${basePath}`, verifyUserAuth, checkUserPermissions, createRole);
  router.patch(`${basePath}/:id`, verifyUserAuth, checkUserPermissions, updateRole);
  router.delete(`${basePath}/:id`, verifyUserAuth, checkUserPermissions, deleteRole);

  return router;
};
