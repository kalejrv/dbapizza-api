import { APIResponse, MYMETYPES, ServerStatusMessage } from "@types";
import { NextFunction, Request, Response } from "express";
import { MulterError, NotFoundError } from "./";

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

  /* Validate if error is a DB error. */
  if (error instanceof NotFoundError) {
    res.status(404).json({
      status: ServerStatusMessage.NOT_FOUND,
      msg: "Requested record wasn't found.",
    });
  };
  
  res.status(500).json({
    status: ServerStatusMessage.FAILED,
    msg: error.message,
  });
};
