import { Request, Response } from "express";
import { RoleRepository, UserRepository } from "@repositories";
import { RoleService, UserService } from "@services";
import { APIResponse, IRoleRepository, IRoleService, IUserRepository, IUserService, Role, ServerStatusMessage, User } from "@types";
import { createToken } from "@utils";

const userRepository: IUserRepository = new UserRepository();
const userService: IUserService = new UserService(userRepository);

const roleRepository: IRoleRepository = new RoleRepository;
const roleService: IRoleService = new RoleService(roleRepository);

const signupUser = async (req: Request, res: Response<APIResponse>): Promise<void> => {
  let newUser: User = req.body;
  
  for (const key in newUser) {
    if (newUser[key as keyof User].length === 0) {
      res.status(400).json({
        status: ServerStatusMessage.BAD_REQUEST,
        msg: "All fields are required.",
      });

      return;
    };
  };

  try {
    const userExists = await userService.findUserByEmail(newUser.email);
    if (userExists) {
      res.status(409).json({
        status: ServerStatusMessage.CONFLICT,
        msg: `Already exists an account with E-mail: ${userExists.email}`,
      });

      return;
    };

    const clientRole = await roleService.findRoleByName("client") as Role;
    newUser.role = clientRole.id;

    const user = await userService.createUser(newUser);
    const { firstName, lastName, address, phone, email, role } = user;
    const token = createToken( { id: user.id });

    res.status(201).json({
      status: ServerStatusMessage.CREATED,
      data: {
        msg: `Welcome, ${user.firstName} ${user.lastName}! You has been registered successfully.`,
        user: {
          firstName,
          lastName,
          address,
          phone,
          email,
          role: role.name,
        },
        token,
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

const signinUser = async (req: Request, res: Response<APIResponse>): Promise<void> => {
  const { body, body: { email, password } } = req;
  
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
    const { firstName, lastName, address, phone } = userExists;

    res.status(200).json({
      status: ServerStatusMessage.OK,
      data: {
        msg: `Welcome, ${firstName} ${lastName}.`,
        user: {
          firstName,
          lastName,
          address,
          phone,
          email,
          role: userExists.role.name,
        },
        token,
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

export {
  signupUser,
  signinUser,
};
