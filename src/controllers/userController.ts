import { Request, Response } from "express";
import { pagination } from "@helpers";
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
      const users = await userService.findUsers();
      if (users.length === 0) {
        res.status(404).json({
          status: ServerStatusMessage.NOT_FOUND,
          msg: "No users found.",
        });
  
        return;
      };
  
      res.status(200).json({
        status: ServerStatusMessage.OK,
        data: {
          users,
          totalUsers: users.length,
          usersByPage: users.length,
          currentUsersQuantity: users.length,
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
    const {
      items: users,
      totalItems: totalUsers,
      itemsByPage: usersByPage,
      currentItemsQuantity: currentUsersQuantity,
      currentPage,
      totalPages,
    } = usersPaginated;

    /* Validate if there isn't users. */
    if (users.length === 0) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: "No users found.",
      });

      return;
    };

    res.status(200).json({
      status: ServerStatusMessage.OK,
      data: {
        users,
        totalUsers,
        usersByPage,
        currentUsersQuantity,
        currentPage,
        totalPages,
      },
    });
  } catch (error: any) {
    console.log("Error: ", error.message);
    res.status(500).json({
      stauts: ServerStatusMessage.FAILED,
      error,
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
      error,
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
      res.status(400).json({
        status: ServerStatusMessage.BAD_REQUEST,
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
      error,
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
    
    res.status(201).json({
      status: ServerStatusMessage.CREATED,
      msg: "User updated successfully.",
      data: userUpdated,
    });
  } catch (error: any) {
    console.log("Error: ", error.message),
    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      error,
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
      status: ServerStatusMessage.OK,
      msg: "User deleted successfully.",
    });
  } catch (error: any) {
    console.log("Error: ", error.message),
    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      error,
    });
  };
};

export {
  findUsers,
  findUserById,
  createUser,
  updateUser,
  deleteUser,
};
