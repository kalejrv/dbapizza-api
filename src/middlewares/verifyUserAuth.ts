import { NextFunction, Request, Response } from "express";
import { APIResponse, IUserRepository, IUserService, ServerStatusMessage, TokenPayload } from "@types";
import { UserRepository } from "@repositories";
import { UserService } from "@services";
import { verifyToken } from "@utils";
import config from "@config/config";

const userRepository: IUserRepository = new UserRepository();
const userService: IUserService = new UserService(userRepository);

export const verifyUserAuth = async (req: Request, res: Response<APIResponse>, next: NextFunction): Promise<void> => {
  const { headers: { authorization } } = req;

  /* Get token from request and verify it. */
  const token = authorization?.split(" ")[1] as string;
  const JWT_SECRET_KEY = config.jwt.secretKey as string;
  const tokenVerified = verifyToken(token, JWT_SECRET_KEY) as TokenPayload;

  try {
    /* Validate that user exists. */
    const user = await userService.findUserById(tokenVerified.userId);
    if (!user) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: "Not user found.",
      });
      
      return;
    };

    /* Add 'userAuth' property with user authenticated info to 'req' object to use it in next middlewares and controllers. */
    req.userAuth = user;

    next();
  } catch (error: any) {
    console.log(`Error: ${error.message}`);
    
    res.status(401).json({
      status: ServerStatusMessage.UNAUTHORIZED,
      msg: error.message,
    });
  };
};
