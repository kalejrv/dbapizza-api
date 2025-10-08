import { Request, Response } from "express";
import { calculateItemsGrowthRate, pagination } from "@helpers";
import { UserRepository } from "@repositories";
import { UserService } from "@services";
import { APIResponse, IUserRepository, IUserService, PaginationModel, ServerStatusMessage, User } from "@types";
import { isAValidId } from "@utils";

const userRepository: IUserRepository = new UserRepository();
const userService: IUserService = new UserService(userRepository);

const findUsers = async (req: Request, res: Response<APIResponse>): Promise<void> => {
  const { query } = req;
  const page: number = Number(query.page);
  const limit: number = Number(query.limit);
  
  try {
    if (Object.values(query).length === 0) {
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

    /* Validate if there isn't users. */
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
    console.log("Error: ", error.message);
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
    console.log("Error: ", error.message);
    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      msg: error.message,
    });
  };
};

const findUserById = async (req: Request, res: Response<APIResponse>): Promise<void> => {
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
    const user = await userService.findUserById(id);
    if (!user) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: "Not user found.",
      });

      return;
    };

    res.status(200).json({
      status: ServerStatusMessage.OK,
      data: user,
    });
  } catch (error: any) {
    console.log("Error: ", error.message);
    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      msg: error.message,
    });
  };
};

const createUser = async (req: Request, res: Response<APIResponse>): Promise<void> => {
  const newUser: User = req.body;
  const { firstName, lastName, address, phone, email, password, role } = newUser;

  for(const key in newUser) {
    if ((newUser[key as keyof User] as string).trim().length === 0) {
      res.status(400).json({
        status: ServerStatusMessage.BAD_REQUEST,
        msg: "Fields can not be empty values.",
      });

      return;
    };
  };
  
  if ((Object.values(newUser).length === 0) || !firstName || !lastName || !address || !phone || !email || !password || !role) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "All fields are required.",
    });
  
    return;
  };
  
  try {
    const userExists = await userService.findUserByEmail(email);
    if (userExists) {
      res.status(200).json({
        status: ServerStatusMessage.OK,
        msg: `Already exists an account with E-mail: ${email}.`,
      });

      return;
    };

    const userCreated = await userService.createUser(newUser);
    
    res.status(201).json({
      status: ServerStatusMessage.CREATED,
      msg: "User created successfully.",
      data: userCreated,
    });
  } catch (error: any) {
    console.log("Error: ", error.message);
    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      msg: error.message,
    });
  };
};

const updateUser = async (req: Request, res: Response<APIResponse>): Promise<void> => {
  const { params: { id }, body } = req;
  const updates: Partial<User> = body;

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
      msg: "Changes are required.",
    });

    return;
  };

  for(const key in updates) {
    if (String(updates[key as keyof User]).trim().length === 0) {
      res.status(400).json({
        status: ServerStatusMessage.BAD_REQUEST,
        msg: "Changes can not be empty values.",
      });

      return;
    };
  };

  try {
    const userExists = await userService.findUserById(id);
    if (!userExists) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: "Not user found.",
      });

      return;
    };

    /* Hash new password if come in updates. */
    let password = updates.password;
    if (password) {
      password = await userExists.hashPassword(password);
    };

    const userUpdated = await userService.updateUser(id, updates);
    
    res.status(200).json({
      status: ServerStatusMessage.UPDATED,
      msg: "User updated successfully.",
      data: userUpdated,
    });
  } catch (error: any) {
    console.log("Error: ", error.message),
    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      msg: error.message,
    });
  };
};

const deleteUser = async (req: Request, res: Response<APIResponse>): Promise<void> => {
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
    const userExists = await userService.findUserById(id);
    if (!userExists) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: "Not user found.",
      });

      return;
    };

    await userService.deleteUser(id);

    res.status(200).json({
      status: ServerStatusMessage.DELETED,
      msg: "User deleted successfully.",
    });
  } catch (error: any) {
    console.log("Error: ", error.message),
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
