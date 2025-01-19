import { RoleRepository } from "@repositories";
import { RoleService } from "@services";
import { IRoleRepository, IRoleService, Role, ServerStatusMessage } from "@types";
import { isAValidId } from "@utils";
import { Request, Response } from "express";

const roleRepository: IRoleRepository = new RoleRepository();
const roleService: IRoleService = new RoleService(roleRepository);

const findRoles = async (_req: Request, res: Response): Promise<void> => {
  try {
    const roles = await roleService.findRoles();

    if (roles.length === 0) {
      res.status(200).json({
        status: ServerStatusMessage.OK,
        msg: "No roles found.",
      });

      return;
    };

    res.status(200).json({
      status: "OK",
      data: roles,
    });
  } catch (error: any) {
    console.log("Error: ", error.message);
    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      error,
    });
  };
};

const findRoleById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const validId = isAValidId(id);
  if (!validId) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "Invalid Id.",
    });

    return;
  };

  try {
    const roleExists = await roleService.findRoleById(id);
    if (!roleExists) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: "Not role found.",
      });

      return;
    };
    
    res.status(200).json({
      status: ServerStatusMessage.OK,
      role: roleExists,
    });
  } catch (error: any) {
    console.log("Error: ", error.message);
    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      error,
    });
  };
};

const createRole = async (req: Request, res: Response): Promise<void> => {
  const newRole: Role = req.body;
  const { name, permissions } = newRole;

  if (!name || name.trim().length === 0)  {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "A role name is neccesary.",
    });
    
    return;
  };

  if (!permissions || permissions.length === 0) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "Role permissions are neccesaries.",
    });
  
    return;
  };

  try {
    const roleExists = await roleService.findRoleByName(name);
    
    if (roleExists) {
      res.status(200).json({
        status: ServerStatusMessage.OK,
        msg: `Already exists '${roleExists.name}' as a role.`,
      });

      return;
    };

    const role = await roleService.createRole(newRole);

    res.status(201).json({
      stauts: ServerStatusMessage.CREATED,
      msg: "New role created.",
      role,
    });
  } catch (error: any) {
    console.log("Error: ", error.message);
    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      error,
    });
  };
};

const updateRole = async (req: Request, res: Response): Promise<void> => {
  const updates = req.body;
  const { id } = req.params;

  const validId = isAValidId(id);
  if (!validId) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "Invalid Id.",
    });

    return;
  };

  if (Object.values(updates).length === 0) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "Changes can not be empty values.",
    });

    return;
  };

  for(const el of Object.values(updates)) {
    if (String(el).trim().length === 0) {
      res.status(400).json({
        status: ServerStatusMessage.BAD_REQUEST,
        msg: "Changes can not be empty values. :(",
      });

      return;
    };
  };

  try {
    const role = await roleService.findRoleById(id);
    if (!role) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: "Not role found.",
      });

      return;
    };

    const roleUpdated = await roleService.updateRole(id, updates);
    res.status(201).json({
      status: ServerStatusMessage.CREATED,
      msg: "Role updated successfully.",
      roleUpdated,
    });
  } catch (error: any) {
    console.log("Error: ", error.message);
    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      error,
    });
  };
};

const deleteRole = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const validId = isAValidId(id);
  if (!validId) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "Invalid Id.",
    });

    return;
  };

  try {
    const roleExists = await roleService.findRoleById(id);
    if (!roleExists) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: "Not role found.",
      });

      return;
    };

    await roleService.deleteRole(id);

    res.status(200).json({
      status: ServerStatusMessage.OK,
      msg: "Role deleted successfully.",
    });
  } catch (error: any) {
    console.log("Error: ", error.message);
    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      error,
    });
  };
};

export {
  findRoles,
  findRoleById,
  createRole,
  updateRole,
  deleteRole,
};
