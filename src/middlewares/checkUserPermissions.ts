import { APIResponse, Method, Permission, permissions, Role, ServerStatusMessage } from "@types";
import { NextFunction, Request, Response } from "express";

export const checkUserPermissions = (req: Request, res: Response<APIResponse>, next: NextFunction): void => {
  const { userAuth, path, method } = req;

  /* Build a permission action with 'req' values, 'permission' variable and 'Method' type. */
  const routePath = path.split("/")[1];
  const permission = permissions.find((permission: Permission): boolean => {
    return permission.method === Method[method as keyof typeof Method];
  });
  const permissionAction = `${routePath}_${permission?.scope}`;

  /* Add permission action to 'permission' array. */
  if (permission?.actions && !permission.actions.includes(permissionAction)) {
    permission.actions.push(permissionAction);
  };

  /* Compare user role permission actions with permission actions to know if role has permission to make action in the route. */
  const rolePermissions = (userAuth.role as Role).permissions;
  const permissionGranted = permission?.actions.find((action): boolean => {
    return rolePermissions.includes(action);
  });
  
  try {
    if (!permissionGranted) {
      res.status(401).json({
        status: ServerStatusMessage.UNAUTHORIZED,
        msg: "User is unauthorized.",
      });
      
      return;
    };

    next();
  } catch (error: any) {
    console.log(`Error: ${error.message}`);
    
    res.status(401).json({
      status: ServerStatusMessage.UNAUTHORIZED,
      msg: error.message,
    });
  };
};
