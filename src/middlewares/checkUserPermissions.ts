import { APIResponse, Method, Permission, permissions, ServerStatusMessage } from "@types";
import { NextFunction, Request, Response } from "express";

export const checkUserPermissions = (req: Request, res: Response<APIResponse>, next: NextFunction): void => {
  const { userAuth, path, method } = req;

  /* Create a permission path with route values. */
  const routePath = path.split("/")[1];
  const permission = permissions.find((permission: Permission): boolean => {
    return permission.method === Method[method as keyof typeof Method];
  });
  const permissionPath = `${routePath}_${permission?.scope}`;

  /* Add permission path created to permission finded. */
  if (!permission?.actions.includes(permissionPath)) {
    permission?.actions.push(permissionPath);
  };

  /* Compare permission path created with role permissions. */
  const rolePermissions = userAuth.role.permissions;
  const permissionsGranted = permission?.actions.find((action): boolean => {
    return rolePermissions.includes(action);
  });

  try {
    if (!permissionsGranted) {
      res.status(401).json({
        status: ServerStatusMessage.UNAUTHORIZED,
        msg: "User is unauthorized.",
      });
      
      return;
    };

    next();
  } catch (error: any) {
    console.log("Error: ", error.message);
    res.status(401).json({
      status: ServerStatusMessage.UNAUTHORIZED,
      error,
    });
  };
};
