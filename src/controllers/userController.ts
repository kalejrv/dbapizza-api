import { UserRepository } from "@repositories";
import { UserService } from "@services";
import { IUserRepository, IUserService, ServerStatusMessage, User } from "@types";
import { isAValidId } from "@utils";
import { Request, Response } from "express";

const userRepository: IUserRepository = new UserRepository();
const userService: IUserService = new UserService(userRepository);

const findUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await userService.findUsers();

    if (users.length === 0) {
      res.status(200).json({
        status: ServerStatusMessage.OK,
        msg: "No users found.",
      });

      return;
    };

    res.status(200).json({
      status: ServerStatusMessage.OK,
      data: users,
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
