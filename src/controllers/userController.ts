import { usersPagination } from "@helpers";
import { UserRepository } from "@repositories";
import { UserService } from "@services";
import { IUserRepository, IUserService, ServerStatusMessage, User } from "@types";
import { isAValidId, isAValidNumber } from "@utils";
import { Request, Response } from "express";

const userRepository: IUserRepository = new UserRepository();
const userService: IUserService = new UserService(userRepository);

const findUsers = async (req: Request, res: Response): Promise<void> => {
  const { query } = req;

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

    /* Validate that query object values are of type "number". */
    const pageIsAValidNumber: boolean = isAValidNumber(query.page as string);
    const limitIsAValidNumber: boolean = isAValidNumber(query.limit as string);
    if (!pageIsAValidNumber || !limitIsAValidNumber) {
      res.status(400).json({
        status: ServerStatusMessage.BAD_REQUEST,
        msg: "Page and limit values can not to be diferent of a valid number.",
      });

      return;
    };

    /* Set page, limit and skip values. */
    const page: number = Number(query.page);
    const limit: number = Number(query.limit);
    const skip: number = (page - 1) * limit;

    /* Validate that page and limit values are not equal to zero. */
    if ((page === 0) || (limit === 0)) {
      res.status(400).json({
        status: ServerStatusMessage.BAD_REQUEST,
        msg: "Page and Limit values can not to be equal to zero.",
      });

      return;
    };

    /* Get paginated orders. */
    const usersPaginated = await usersPagination({ page, limit, skip });
    const { users, totalUsers, usersByPage, currentUsersQuantity, currentPage, totalPages } = usersPaginated;

    /* Validate if there isn't orders. */
    if (users.length === 0) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: "No users found.",
      });

      return;
    };
    
    /* Response users paginated data. */
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

const findUserById = async (req: Request, res: Response): Promise<void> => {
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

const createUser = async (req: Request, res: Response): Promise<void> => {
  const newUser: User = req.body;
  for(const el of Object.values(newUser)) {
    if (String(el).trim().length === 0) {
      res.status(400).json({
        status: ServerStatusMessage.BAD_REQUEST,
        msg: "Fields can not be empty values.",
      });

      return;
    };
  };
  
  const { firstName, lastName, address, phone, email, password, role } = newUser;
  if (!firstName || !lastName || !address || !phone || !email || !password || !role) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "All fields are required.",
    });

    return;
  };

  try {
    const userExists = await userService.findUserByEmail(email);
    if (userExists) {
      console.log(userExists);
      res.status(400).json({
        status: ServerStatusMessage.BAD_REQUEST,
        msg: `Already exists an account with E-mail: ${email}`,
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

const updateUser = async (req: Request, res: Response): Promise<void> => {
  const { params: { id }, body } = req;
  const updates = body;

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

    if (body.password) {
      body.password = await userExists.hashPassword(body.password);
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

const deleteUser = async (req: Request, res: Response): Promise<void> => {
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
