import { createRole, deleteRole, findRoleById, findRoles, updateRole } from "@controllers";
import { Router } from "express";

const router = Router();
const basePath: string = "/roles";

export const roleRoutes = () => {
  router.get(`${basePath}`, findRoles)
        .get(`${basePath}/:id`, findRoleById);
  router.post(`${basePath}`, createRole);
  router.patch(`${basePath}/:id`, updateRole);
  router.delete(`${basePath}/:id`, deleteRole);

  return router;
};
