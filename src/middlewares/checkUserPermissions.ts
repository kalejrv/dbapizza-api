import { Method, permissions, ServerStatusMessage } from "@types";
import { NextFunction, Request, Response } from "express";

export const checkUserPermissions = (req: Request, res: Response, next: NextFunction): void => {
  const { userAuth, path, method } = req;

  const currentPath = path.split("/")[1];
  const findPermission = permissions.find(permission => permission.method === Method[method as keyof typeof Method]);
  const permissionPath = `${currentPath}_${findPermission?.scope}`;

  if (!findPermission?.permissions.includes(permissionPath)) {
    findPermission?.permissions.push(permissionPath);
  };

  const rolePermissions = userAuth.role.permissions;
  const permissionsGranted = findPermission?.permissions.find(permission => rolePermissions.includes(permission))

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
