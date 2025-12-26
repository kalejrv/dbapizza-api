import { Request, Response } from "express";
import { RoleRepository, UserRepository } from "@repositories";
import { RoleService, UserService } from "@services";
import { APIResponse, IRoleRepository, IRoleService, IUserRepository, IUserService, NewUser, Role, RoleDoc, ServerStatusMessage, User, UserDoc } from "@types";
import { createToken } from "@utils";

const userRepository: IUserRepository = new UserRepository();
const userService: IUserService = new UserService(userRepository);

const roleRepository: IRoleRepository = new RoleRepository;
const roleService: IRoleService = new RoleService(roleRepository);

const signupUser = async (req: Request, res: Response<APIResponse>): Promise<void> => {
  let newUser: User = req.body;
  
  /* Validate that values from request don't be empty values. */
  for (const key in newUser) {
    if (newUser[key as keyof NewUser].length === 0) {
      res.status(400).json({
        status: ServerStatusMessage.BAD_REQUEST,
        msg: "All fields are required.",
      });

      return;
    };
  };

  try {
    /* Validate that if user already exists don't register them.  */
    const userExists = await userService.findUserByEmail(newUser.email);
    if (userExists) {
      res.status(409).json({
        status: ServerStatusMessage.CONFLICT,
        msg: `Already exists an account with E-mail: ${userExists.email}`,
      });

      return;
    };

    /* Assign 'client' role to new user. */
    const clientRole = await roleService.findRoleByName("client") as RoleDoc;
    const userRole = clientRole._id.toString();

    /* Create new user record. */
    const user = await userService.createUser({ ...newUser, role: userRole }) as UserDoc;
    const { firstName, lastName, address, phone, email, role } = user;
    const token = createToken( { id: user._id.toString() });

    res.status(201).json({
      status: ServerStatusMessage.CREATED,
      data: {
        msg: `Welcome, ${firstName} ${lastName}! You has been registered successfully.`,
        user: {
          firstName,
          lastName,
          address,
          phone,
          email,
          role: (role as Role).name,
        },
        token,
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

const signinUser = async (req: Request, res: Response<APIResponse>): Promise<void> => {
  const { body, body: { email, password } } = req;
  
  /* Validate that email and password don't be empty values. */
  if ((Object.values(body).length === 0) || !email || !password) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "E-mail and Password are required.",
    });

    return;
  };
  
  try {
    /* Validate that user exists. */
    const userExists = await userService.findUserByEmail(email) as UserDoc;
    if (!userExists) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: `There is not exist an account with E-mail: ${email}.`,
      });

      return;
    };

    /* Validate that password from request matches user password. */
    const passwordMatch = await userExists.comparePassword(password);
    if (!passwordMatch) {
      res.status(400).json({
        status: ServerStatusMessage.BAD_REQUEST,
        msg: "Incorrect password.",
      });

      return;
    };

    /* Create token for start loggin session. */
    const token = createToken({ id: userExists._id.toString() });
    const { firstName, lastName, address, phone, role } = userExists;

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
          role: (role as Role).name,
        },
        token,
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

export {
  signupUser,
  signinUser,
};
