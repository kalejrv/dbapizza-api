import { Request, Response } from "express";
import { SizeRepository } from "@repositories";
import { SizeService } from "@services";
import { APIResponse, ISizeRepository, ISizeService, ServerStatusMessage, Size, SizeDoc } from "@types";
import { isAValidId } from "@utils";

const sizeRepository: ISizeRepository = new SizeRepository();
const sizeService: ISizeService = new SizeService(sizeRepository);

const findSizes = async (_req: Request, res: Response<APIResponse>): Promise<void> => {
  try {
    /* Validate if there aren't sizes registered. */
    const sizes = await sizeService.findSizes();
    if (sizes.length === 0) {
      res.status(200).json({
        status: ServerStatusMessage.OK,
        msg: "No sizes yet.",
      });

      return;
    };

    res.status(200).json({
      status: ServerStatusMessage.OK,
      data: sizes,
    });
  } catch (error: any) {
    console.log(`Error: ${error.message}`);
    
    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      msg: error.message,
    });
  };
};

const findSizeById = async (req: Request, res: Response<APIResponse>): Promise<void> => {
  const { id } = req.params;
  
  /* Validate that size id be a valid id. */
  const validId = isAValidId(id);
  if (!validId) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "Invalid Id.",
    });

    return;
  };
  
  try {
    /* Validate if size doesn't exists. */
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
    console.log(`Error: ${error.message}`);
    
    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      msg: error.message,
    });
  };
};

const createSize = async (req: Request, res: Response<APIResponse>): Promise<void> => {
  const newSize: Size = req.body;
  const { name, price } = newSize;
  
  /* Validate that size values from request don't be empty values. */
  for (const key in newSize) {
    if (String(newSize[key as keyof Size]).trim().length === 0) {
      res.status(400).json({
        status: ServerStatusMessage.BAD_REQUEST,
        msg: "Fields can not be empty values.",
      });

      return;
    };
  };

  /* Validate size values as reuired values to create a new size record. */
  if ((Object.values(newSize).length === 0) || !name || !price) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "All fields are required.",
    });

    return;
  };

  try {
    /* Validate that if there's a size with same name from request isn't possible to create it. */
    const sizeExists = await sizeService.findSizeByName(name);
    if (sizeExists) {
      res.status(409).json({
        status: ServerStatusMessage.CONFLICT,
        msg: `Already exists a size with name: ${sizeExists.name}.`, 
      });

      return;
    };

    /* Create size and save it. */
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
    console.log(`Error: ${error.message}`);
    
    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      msg: error.message,
    });
  };
};

const updateSize = async (req: Request, res: Response<APIResponse>): Promise<void> => {
  const { params: { id }, body } = req;
  const updates: Partial<Size> = body;

  /* Validate that size id be a valid id. */
  const validId = isAValidId(id);
  if (!validId) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "Invalid Id.",
    });

    return;
  };

  /* Validate that updates can not be empty values. */
  for (const key in updates) {
    if (String(updates[key as keyof Size]).trim().length === 0) {
      res.status(400).json({
        status: ServerStatusMessage.BAD_REQUEST,
        msg: "Updates can not be empty values.",
      });

      return;
    };
  };
  
  /* Validate that come at least one update value in request. */
  if (Object.values(updates).length === 0) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "At least one update is required.",
    });

    return;
  };

  try {
    /* Validate that if size doesn't exists isn't possible update it. */
    const sizeExists = await sizeService.findSizeById(id) as SizeDoc;
    if(!sizeExists) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: "Not size found.",
      });

      return;
    };

    /* Validate that if already exists a size with same name don't update it. */
    if (updates.name) {
      const sizeWithSameName = await sizeService.findSizeByName(updates.name) as SizeDoc;
      if (sizeWithSameName && (sizeWithSameName.id !== sizeExists.id)) {
        res.status(409).json({
          status: ServerStatusMessage.CONFLICT,
          msg: `Already exists a size with name: ${updates.name}.`,
        });

        return;
      };
    };

    /* Update size. */
    const sizeUpdated = await sizeService.updateSize(id, updates);

    res.status(200).json({
      status: ServerStatusMessage.UPDATED,
      msg: "Size updated successfully.",
      data: sizeUpdated,
    });
  } catch (error: any) {
    console.log(`Error: ${error.message}`);
    
    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      msg: error.message,
    });
  };
};

const deleteSize = async (req: Request, res: Response<APIResponse>): Promise<void> => {
  const { id } = req.params;

  /* Validate that size id be a valid id. */
  const validId = isAValidId(id);
  if (!validId) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "Invalid Id.",
    });

    return;
  };

  try {
    /* Validate that if size doesn't exist isn't possible to delete it. */
    const sizeExists = await sizeService.findSizeById(id);
    if(!sizeExists) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: "Not size found.",
      });

      return;
    };

    /* Delete size. */
    await sizeService.deleteSize(id);

    res.status(200).json({
      status: ServerStatusMessage.DELETED,
      msg: "Size deleted successfully.",
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
  findSizes,
  findSizeById,
  createSize,
  updateSize,
  deleteSize,
};
