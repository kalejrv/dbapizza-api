import { RoleRepository, UserRepository } from "@repositories";
import { RoleService, UserService } from "@services";
import { IRoleRepository, IRoleService, IUserRepository, IUserService, ServerStatusMessage, User } from "@types";
import { createToken } from "@utils";
import { Request, Response } from "express";

const userRepository: IUserRepository = new UserRepository();
const userService: IUserService = new UserService(userRepository);

const roleRepository: IRoleRepository = new RoleRepository;
const roleService: IRoleService = new RoleService(roleRepository);

const signupUser = async (req: Request, res: Response): Promise<void> => {
  let newUser: User = req.body;
  const { firstName, lastName, address, phone, email, password } = newUser;
  
  if ((Object.values(newUser).length === 0) || !firstName || !lastName || !address || !phone || !email || !password) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "All user fields are required.",
    });

    return;
  };

  for (const el of Object.values(req.body)) {
    if (String(el).trim().length === 0) {
      res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "User fields can not be empty values.",
      });

      return;
    };
  };

  try {
    const userExists = await userService.findUserByEmail(email);
    if (userExists) {
      res.status(400).json({
        status: ServerStatusMessage.BAD_REQUEST,
        msg: `Already exists an account with E-mail: ${email}`,
      });

      return;
    };

    const clientRole = await roleService.findRoleByName("client");
    if (clientRole) {
      newUser.role = clientRole.id;
    };

    const user = await userService.createUser(newUser);

    res.status(201).json({
      status: ServerStatusMessage.CREATED,
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

const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { body, body: { email, password } } = req;
  
  for (const el of Object.values(body)) {
    if (String(el).trim().length === 0) {
      res.status(400).json({
        status: ServerStatusMessage.BAD_REQUEST,
        msg: "E-mail and Password can not be empty values.",
      });

      return;
    };
  };

  if ((Object.values(body).length === 0) || !email || !password) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "E-mail and password are required.",
    });

    return;
  };

  try {
    const userExists = await userService.findUserByEmail(email);
    if (!userExists) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: `There is not exist an account with E-mail: ${email}.`,
      });

      return;
    };

    const passwordMatch = await userExists.comparePassword(password);
    if (!passwordMatch) {
      res.status(400).json({
        status: ServerStatusMessage.BAD_REQUEST,
        msg: "Incorrect password.",
      });

      return;
    };

    const token = createToken({ id: userExists.id });

    res.status(200).json({
      status: ServerStatusMessage.OK,
      msg: `${userExists.firstName} logged successfully.`,
      token,
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
  signupUser,
  loginUser,
};
