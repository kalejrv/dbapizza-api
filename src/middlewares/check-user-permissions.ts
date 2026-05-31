import { APIResponse, Method, Permission, permissions, Role, ServerStatusMessage } from "@types";
import { NextFunction, Request, Response } from "express";

export const checkUserPermissions = (req: Request, res: Response<APIResponse>, next: NextFunction): void => {
  const { userAuth, path, method } = req;

  /* Build a permission action with 'req' values, 'permission' variable and 'Method' type. */
  const routePath = path.split("/")[1];
  const permission = permissions.find((permission: Permission): boolean => {
    return permission.method === Method[method as keyof typeof Method];
  });
  
  try {
    /* Validate that exist a permission with same method that method from req. */
    if (!permission) throw new Error("There isn't any permission founded.");
    
    /* Add a permission action to 'permission' variable. */
    const permissionAction = `${routePath}_${permission.scope}`;
    if (!permission.actions.includes(permissionAction)) {
      permission.actions.push(permissionAction);
    };

    /* Validate that userAuth exists in Request object. */
    if (!userAuth) throw new Error("User not authenticated.");

    /* Compare user role permission actions with permission actions to know if role has permission to make action in the route. */
    const userRolePermissions = (userAuth.role as Role).permissions;
    const permissionGranted = permission.actions.find((action: string): boolean => {
      return userRolePermissions.includes(action);
    });
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
