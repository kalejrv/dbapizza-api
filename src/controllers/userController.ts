import { Request, Response } from "express";
import { calculateItemsGrowthRate, pagination } from "@helpers";
import { RoleRepository, UserRepository } from "@repositories";
import { RoleService, UserService } from "@services";
import { APIResponse, IRoleRepository, IRoleService, IUserRepository, IUserService, PaginationModel, ServerStatusMessage, User } from "@types";
import { isAValidId } from "@utils";

const userRepository: IUserRepository = new UserRepository();
const userService: IUserService = new UserService(userRepository);

const roleRepository: IRoleRepository = new RoleRepository();
const roleService: IRoleService = new RoleService(roleRepository);

const findUsers = async (req: Request, res: Response<APIResponse>): Promise<void> => {
  const { query } = req;
  const page: number = Number(query.page);
  const limit: number = Number(query.limit);
  
  try {
    /* Validate if query values don't come in request. */
    if (Object.values(query).length === 0) {
      /* Validate if there aren't users registered yet. */
      const items = await userService.findUsers();
      if (items.length === 0) {
        res.status(200).json({
          status: ServerStatusMessage.OK,
          msg: "No users yet.",
          data: {
            items,
            totalItems: items.length,
          },
        });

        return;
      };
  
      res.status(200).json({
        status: ServerStatusMessage.OK,
        data: {
          items,
          totalItems: items.length,
          itemsByPage: items.length,
          currentItemsQuantity: items.length,
          currentPage: 1,
          totalPages: 1,
        },
      });

      return;
    };
    
    /* Validate that page and limit query params be valid values. */
    if ((!page || (page < 0)) || (!limit || limit < 0)) {
      res.status(400).json({
        status: ServerStatusMessage.BAD_REQUEST,
        msg: "Page and limit query params are required as valid number values.",
      });

      return;
    };

    /* Get paginated users. */
    const skip: number = (page - 1) * limit;
    const usersPaginated = await pagination({ model: PaginationModel.Users, page, limit, skip });
    const { items, totalItems, itemsByPage, currentItemsQuantity, currentPage, totalPages } = usersPaginated;

    /* Validate if there aren't users registered yet. */
    if (items.length === 0) {
      res.status(200).json({
        status: ServerStatusMessage.OK,
        msg: "No users yet.",
        data: {
          items,
          totalItems: items.length,
        },
      });

      return;
    };

    res.status(200).json({
      status: ServerStatusMessage.OK,
      data: {
        items,
        totalItems,
        itemsByPage,
        currentItemsQuantity,
        currentPage,
        totalPages,
      },
    });
  } catch (error: any) {
    console.log(`Error: ${error.message}`);

    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      msg: error.message,
    });
  };
};

const findUsersStatsByMonth = async (req: Request, res: Response<APIResponse>): Promise<void> => {
  const { query } = req;
  const year = Number(query.year);
  const month = Number(query.month);

  /* Validate that year and month values come in query request. */
  if (!year || !month) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "A valid year and month is required.",
    });

    return;
  };

  /* Build current month dates range. */
  const startOfCurrentMonth = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
  const endOfCurrentMonth = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

  /* Build last month dates range. */
  const startOfLastMonth = new Date(Date.UTC(year, month - 2, 1, 0, 0, 0, 0));
  const endOfLasMonth = new Date(Date.UTC(year, month - 1, 0, 23, 59, 59, 999));

  try {
    /* Get users count by months. */
    const [currentMonthItemsCount, lastMonthItemsCount, totalItemsCount] = await Promise.all([
      userService.findUsersCount({
        createdAt: {
          $gte: startOfCurrentMonth,
          $lte: endOfCurrentMonth,
        },
      }),
      userService.findUsersCount({
        createdAt: {
          $gte: startOfLastMonth,
          $lte: endOfLasMonth,
        },
      }),
      userService.findUsersCount(),
    ]);

    /* Calculate month items growth rate. */
    const itemsGrowthRate = calculateItemsGrowthRate({ currentMonthItemsCount, lastMonthItemsCount });

    res.status(200).json({
      status: ServerStatusMessage.OK,
      data: {
        year,
        month,
        items: {
          currentMonthItemsCount: itemsGrowthRate.currentMonthItemsCount,
          lastMonthItemsCount: itemsGrowthRate.lastMonthItemsCount,
          itemsGrowthRate: itemsGrowthRate.itemsGrowthRate,
          totalItemsCount,
        },
      },
    });
  } catch (error: any) {
    console.log(`Error: ${error.message}`);

    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      msg: error.message,
    });
  };
};

const findUserById = async (req: Request, res: Response<APIResponse>): Promise<void> => {
  const { id } = req.params;
  
  /* Validate that id be a valid user id. */
  const validId = isAValidId(id);
  if (!validId) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "Invalid Id.",
    });

    return;
  };

  try {
    /* Validate that user exists. */
    const userExists = await userService.findUserById(id);
    if (!userExists) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: "Not user found.",
      });

      return;
    };

    res.status(200).json({
      status: ServerStatusMessage.OK,
      data: userExists,
    });
  } catch (error: any) {
    console.log(`Error: ${error.message}`);

    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      msg: error.message,
    });
  };
};

const createUser = async (req: Request, res: Response<APIResponse>): Promise<void> => {
  const newUser: User = req.body;
  const { firstName, lastName, address, phone, email, password, role } = newUser;  
  
  /* Validate that all User properties come into request. */
  if ((Object.values(newUser).length === 0) || !firstName || !lastName || !address || !phone || !email || !password || !role) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "All fields are required.",
    });
  
    return;
  };

  /* Validate that role be a valid role id. */
  const validId = isAValidId(role as string);
  if (!validId) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "Invalid role Id.",
    });

    return;
  };

  try {
    /* Validate that if user exists don't save them again. */
    const userExists = await userService.findUserByEmail(email);
    if (userExists) {
      res.status(409).json({
        status: ServerStatusMessage.CONFLICT,
        msg: `Already exists an account with E-mail: ${email}.`,
      });

      return;
    };

    /* Validate that role exists. */
    const roleExists = await roleService.findRoleById(role as string);
    if (!roleExists) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: "Not user role found.",
      });

      return;
    };

    /* Create user and save them. */
    const userCreated = await userService.createUser(newUser);
    
    res.status(201).json({
      status: ServerStatusMessage.CREATED,
      msg: "User created successfully.",
      data: userCreated,
    });
  } catch (error: any) {
    console.log(`Error: ${error.message}`);

    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      msg: error.message,
    });
  };
};

const updateUser = async (req: Request, res: Response<APIResponse>): Promise<void> => {
  const { params: { id }, body } = req;
  const updates: Partial<User> = body;

  /* Validate that user id be a valid id. */
  const validId = isAValidId(id);
  if (!validId) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "Invalid Id.",
    });

    return;
  };

  /* Validate that exists at least one update. */
  if (Object.values(updates).length === 0) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "At least one update is required.",
    });

    return;
  };

  /* Validate that updates don't be empty values. */
  for(const key in updates) {
    const value = updates[key as keyof Omit<User, 'hashPassword' | 'comparePassword'>];

    if ((typeof value === "string") && value.trim().length === 0) {
      res.status(400).json({
        status: ServerStatusMessage.BAD_REQUEST,
        msg: "Updates can not be empty values.",
      });
      
      return;
    };
  };

  try {
    /* Validate if user not exists don't apply updates. */
    const userExists = await userService.findUserById(id);
    if (!userExists) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: "Not user found.",
      });

      return;
    };

    /* Hash new password if come in updates. */
    if (updates.password) {
      updates.password = await userExists.hashPassword(updates.password);
    };

    /* Save user updates. */
    const userUpdated = await userService.updateUser(id, updates);

    res.status(200).json({
      status: ServerStatusMessage.UPDATED,
      msg: "User updated successfully.",
      data: userUpdated,
    });
  } catch (error: any) {
    console.log(`Error: ${error.message}`);

    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      msg: error.message,
    });
  };
};

const deleteUser = async (req: Request, res: Response<APIResponse>): Promise<void> => {
  const { id } = req.params;
  
  /* Validate that user id be a valid id. */
  const validId = isAValidId(id);
  if (!validId) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "Invalid Id.",
    });

    return;
  };
  
  try {
    /* Validate that user exists to delete them. */
    const userExists = await userService.findUserById(id);
    if (!userExists) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: "Not user found.",
      });

      return;
    };

    /* Delete user. */
    await userService.deleteUser(id);

    res.status(200).json({
      status: ServerStatusMessage.DELETED,
      msg: "User deleted successfully.",
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
  findUsers,
  findUsersStatsByMonth,
  findUserById,
  createUser,
  updateUser,
  deleteUser,
};
