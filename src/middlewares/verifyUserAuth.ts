import { NextFunction, Request, Response } from "express";
import { APIResponse, IUserRepository, IUserService, ServerStatusMessage } from "@types";
import { UserRepository } from "@repositories";
import { UserService } from "@services";
import { verifyToken } from "@utils";
import config from "@config/config";

const userRepository: IUserRepository = new UserRepository();
const userService: IUserService = new UserService(userRepository);

export const verifyUserAuth = async (req: Request, res: Response<APIResponse>, next: NextFunction): Promise<void> => {
  const { headers: { authorization } } = req;

  const token = authorization?.split(" ")[1] as string;
  const JWT_SECRET_KEY = config.jwt.secretKey as string;
  const userTokenVerified = verifyToken(token, JWT_SECRET_KEY);

  try {
    const user = await userService.findUserById(userTokenVerified.id);
    if (!user) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: "Not user found.",
      });
      
      return;
    };

    if (user.id !== userTokenVerified.id) {
      res.status(401).json({
        status: ServerStatusMessage.UNAUTHORIZED,
        msg: "User is unauthorized.",
      });

      return;
    };

    req.userAuth = user;
    
    next();
  } catch (error: any) {
    console.log("Error: ", error.message);
    res.status(401).json({
      status: ServerStatusMessage.UNAUTHORIZED,
      error,
    });
  };
};
