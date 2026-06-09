import { APIResponse, MYMETYPES, ServerStatusMessage } from "@types";
import { NextFunction, Request, Response } from "express";
import { MulterError } from "./";

export const errorHandler = (error: Error, _req: Request, res: Response<APIResponse>, _next: NextFunction): void => { 
  /* Validate if error is a Multer error. */
  if (error instanceof MulterError) {
    const allowedMymetypes: string = Object.values(MYMETYPES)
      .join()
      .split("image/")
      .join(" ")
      .trim();
    
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: `Only images with these formats are allowed: ${allowedMymetypes}.`,
    });

    return;
  };
  
  res.status(500).json({
    status: ServerStatusMessage.FAILED,
    msg: error.message,
  });
};
