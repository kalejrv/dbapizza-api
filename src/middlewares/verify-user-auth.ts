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
  
  try {
    /* Validate that token exists. */
    if (!authorization?.startsWith("Bearer ")) {
      res.status(401).json({
        status: ServerStatusMessage.UNAUTHORIZED,
        msg: "Token not provided.",
      });

      return;
    };

    /* Verify that token be a valid token. */
    const token = authorization?.split(" ")[1] as string;
    const key = config.jwt.secretKey as string;
    const tokenVerified = verifyToken(token, key) as TokenPayload;
    
    /* Validate that user exists. */
    const { userId } = tokenVerified;
    const user = await userService.findUserById(userId);
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
