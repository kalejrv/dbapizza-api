import { Request, Response } from "express";
import { RoleRepository } from "@repositories";
import { RoleService } from "@services";
import { APIResponse, IRoleRepository, IRoleService, Role, ServerStatusMessage } from "@types";
import { isAValidId } from "@utils";

const roleRepository: IRoleRepository = new RoleRepository();
const roleService: IRoleService = new RoleService(roleRepository);

const findRoles = async (_req: Request, res: Response<APIResponse>): Promise<void> => {
  try {
    /* Validate that exists roles. */
    const roles = await roleService.findRoles();
    if (roles.length === 0) {
      res.status(200).json({
        status: ServerStatusMessage.OK,
        msg: "No roles found.",
      });

      return;
    };

    res.status(200).json({
      status: ServerStatusMessage.OK,
      data: roles,
    });
  } catch (error: any) {
    console.log(`Error: ${error.message}`);
    
    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      msg: error.message,
    });
  };
};

const findRoleById = async (req: Request, res: Response<APIResponse>): Promise<void> => {
  const { id } = req.params;

  /* Validate that role id be a valid id. */
  const validId = isAValidId(id);
  if (!validId) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "Invalid Id.",
    });
    
    return;
  };

  try {
    /* Validate that role exists. */
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
      data: roleExists,
    });
  } catch (error: any) {
    console.log(`Error: ${error.message}`);
    
    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      msg: error.message,
    });
  };
};

const createRole = async (req: Request, res: Response<APIResponse>): Promise<void> => {
  const newRole: Role = req.body;
  const { name, permissions } = newRole;

  /* Validate role name. */
  if (!name || name.trim().length === 0)  {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "A role name is required.",
    });
    
    return;
  };

  /* Validate role permissions. */
  if (!permissions || permissions.length === 0) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "Role permissions are required.",
    });
  
    return;
  };

  try {
    /* Validate that if role exists don't save it. */
    const roleExists = await roleService.findRoleByName(name);
    if (roleExists) {
      res.status(409).json({
        status: ServerStatusMessage.CONFLICT,
        msg: `Already exists '${roleExists.name}' as a role.`,
      });

      return;
    };

    /* Create role and save it. */
    const role = await roleService.createRole(newRole);

    res.status(201).json({
      status: ServerStatusMessage.CREATED,
      msg: "Role created successfully.",
      data: role,
    });
  } catch (error: any) {
    console.log(`Error: ${error.message}`);

    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      msg: error.message,
    });
  };
};

const updateRole = async (req: Request, res: Response<APIResponse>): Promise<void> => {
  const { body, params } = req;
  const { id } = params;
  const updates: Partial<Role> = body;
  const { name, permissions } = updates;

  /* Validate that role id be a valid id. */
  const validId = isAValidId(id);
  if (!validId) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "Invalid Id.",
    });

    return;
  };

  /* Validate that exists at least one role property update. */
  if (Object.values(updates).length === 0) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "Role updates are required.",
    });

    return;
  };

  /* Validate role name. */
  if (name?.trim().length === 0) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "Role name is required.",
    });

    return;
  };
  
  /* Validate role permissions. */
  if (permissions && permissions.length === 0) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "Permissions are required.",
    });
  
    return;
  };

  try {
    /* Validate that if role don't exists isn't possible to update it. */
    const roleExists = await roleService.findRoleById(id);
    if (!roleExists) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: "Not role found.",
      });

      return;
    };

    /* Add new updates to role and save them. */
    const roleUpdated = await roleService.updateRole(id, updates);
    
    res.status(201).json({
      status: ServerStatusMessage.UPDATED,
      msg: "Role updated successfully.",
      data: roleUpdated,
    });
  } catch (error: any) {
    console.log(`Error: ${error.message}`);

    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      msg: error.message,
    });
  };
};

const deleteRole = async (req: Request, res: Response<APIResponse>): Promise<void> => {
  const { id } = req.params;

  /* Validate that role id be a valid id. */
  const validId = isAValidId(id);
  if (!validId) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "Invalid Id.",
    });

    return;
  };

  try {
    /* Validate that if role don't exists isn't possible to delete it. */
    const roleExists = await roleService.findRoleById(id);
    if (!roleExists) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: "Not role found.",
      });

      return;
    };

    /* Delete role. */
    await roleService.deleteRole(id);

    res.status(200).json({
      status: ServerStatusMessage.OK,
      msg: "Role deleted successfully.",
    });
  } catch (error: any) {
    console.log(`Error: ${error.message}`);

    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      msg: error.message,
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
