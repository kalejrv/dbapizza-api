import { Request, Response } from "express";
import { SizeRepository } from "@repositories";
import { SizeService } from "@services";
import { APIResponse, ISizeRepository, ISizeService, ServerStatusMessage, Size } from "@types";
import { isAValidId } from "@utils";

const sizeRepository: ISizeRepository = new SizeRepository();
const sizeService: ISizeService = new SizeService(sizeRepository);

const findSizes = async (_req: Request, res: Response<APIResponse>): Promise<void> => {
  try {
    const sizes = await sizeService.findSizes();
    
    if (sizes.length === 0) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: "No sizes found.",
      });

      return;
    };
  
    res.status(200).json({
      status: ServerStatusMessage.OK,
      data: sizes,
    });
  } catch (error: any) {
    console.log("Error: ", error.message);
    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      error,
    });
  };
};

const findSizeById = async (req: Request, res: Response<APIResponse>): Promise<void> => {
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
    const sizeExists = await sizeService.findSizeById(id);
    if (!sizeExists) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: "Not size found.", 
      });

      return;
    };

    res.status(200).json({
      status: ServerStatusMessage.OK,
      data: sizeExists,
    });
  } catch (error: any) {
    console.log("Error: ", error.message);
    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      error,
    });
  };
};

const createSize = async (req: Request, res: Response<APIResponse>): Promise<void> => {
  const newSize: Size = req.body;
  const { name, price } = newSize;
  
  for (const key in newSize) {
    if (String(newSize[key as keyof Size]).trim().length === 0) {
      res.status(400).json({
        status: ServerStatusMessage.BAD_REQUEST,
        msg: "Fields can not be empty values.",
      });

      return;
    };
  };

  if ((Object.values(newSize).length === 0) || !name || !price) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "All fields are required.",
    });

    return;
  };

  try {
    const sizeExists = await sizeService.findSizeByName(name);
    if (sizeExists) {
      res.status(400).json({
        status: ServerStatusMessage.BAD_REQUEST,
        msg: `Already exists a size with name: ${sizeExists.name}.`, 
      });

      return;
    };

    const size = await sizeService.createSize({
      ...newSize,
      price: Number(price),
    });
    
    res.status(201).json({
      status: ServerStatusMessage.CREATED,
      msg: "Size created successfully.",
      data: size,
    });
  } catch (error: any) {
    console.log("Error: ", error.message);
    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      error,
    });
  };
};

const updateSize = async (req: Request, res: Response<APIResponse>): Promise<void> => {
  const { params: { id }, body } = req;
  const updates: Partial<Size> = body;

  const validId = isAValidId(id);
  if (!validId) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "Invalid Id.",
    });

    return;
  };

  for (const key in updates) {
    if (String(updates[key as keyof Size]).trim().length === 0) {
      res.status(400).json({
        status: ServerStatusMessage.BAD_REQUEST,
        msg: "Changes can not be empty values.",
      });

      return;
    };
  };
  
  if (Object.values(updates).length === 0) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "Changes are required.",
    });

    return;
  };

  try {
    const sizeExists = await sizeService.findSizeById(id);
    if(!sizeExists) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: "Not size found.",
      });

      return;
    };

    const sizeUpdated = await sizeService.updateSize(id, updates);

    res.status(201).json({
      status: ServerStatusMessage.CREATED,
      msg: "Size updated successfully.",
      data: sizeUpdated,
    });
  } catch (error: any) {
    console.log("Error: ", error.message);
    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      error,
    });
  };
};

const deleteSize = async (req: Request, res: Response<APIResponse>): Promise<void> => {
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
    const sizeExists = await sizeService.findSizeById(id);
    if(!sizeExists) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: "Not size found.",
      });

      return;
    };

    await sizeService.deleteSize(id);

    res.status(200).json({
      status: ServerStatusMessage.OK,
      msg: "Size deleted successfully.",
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
  findSizes,
  findSizeById,
  createSize,
  updateSize,
  deleteSize,
};
