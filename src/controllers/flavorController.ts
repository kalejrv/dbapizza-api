import { FlavorRepository } from "@repositories";
import { FlavorService } from "@services";
import { Flavor, IFlavorRepository, IFlavorService, ServerStatusMessage } from "@types";
import { isAValidId } from "@utils";
import { Request, Response } from "express";

const flavorRepository: IFlavorRepository = new FlavorRepository();
const flavorService: IFlavorService = new FlavorService(flavorRepository);

const findFlavors = async (_req: Request, res: Response): Promise<void> => {
  try {
    const flavors = await flavorService.findFlavors();
    if (flavors.length === 0) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: "No flavor found.",
      });

      return;
    };

    res.status(200).json({
      status: ServerStatusMessage.OK,
      flavors,
    });
  } catch (error: any) {
    console.log("Error: ", error.message);
    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      error,
    });
  };
};

const findFlavorById = async (req: Request, res: Response): Promise<void> => {
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
    const flavor = await flavorService.findFlavorById(id);
    if (!flavor) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: "Not flavor found.", 
      });

      return;
    };

    res.status(200).json({
      status: ServerStatusMessage.OK,
      data: flavor,
    });
  } catch (error: any) {
    console.log("Error: ", error.message);
    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      error,
    });
  };
};

const createFlavor = async (req: Request, res: Response): Promise<void> => {
  const newFlavor: Flavor = req.body;
  
  for (const el of Object.values(newFlavor)) {
    if (String(el).trim().length === 0) {
      res.status(400).json({
        status: ServerStatusMessage.BAD_REQUEST,
        msg: "Flavor fields can not be empty values.",
      });

      return;
    };
  };

  const { name, description, price } = newFlavor;
  if ((Object.values(newFlavor).length === 0) || !name || !description || !price) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "All fields are required.",
    });

    return;
  }

  try {
    const flavorExists = await flavorService.findFlavorByName(name);
    if (flavorExists) {
      res.status(400).json({
        status: ServerStatusMessage.BAD_REQUEST,
        msg: `Already exists a flavor with name: ${flavorExists.name}.`, 
      });

      return;
    };

    const flavor = await flavorService.createFlavor({...newFlavor, price: Number(price)});
    
    res.status(201).json({
      status: ServerStatusMessage.CREATED,
      msg: "Flavor created successfully.",
      data: flavor,
    });
  } catch (error: any) {
    console.log("Error: ", error.message);
    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      error,
    });
  };
};

const updateFlavor = async (req: Request, res: Response): Promise<void> => {
  const { params: { id }, body } = req;
  const updates = body;

  const validId = isAValidId(id);
  if (!validId) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "Invalid Id.",
    });

    return;
  };

  for (const el of Object.values(updates)) {
    if (String(el).trim().length === 0) {
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
      msg: "All flavor fields are required.",
    });
  
    return;  
  };

  try {
    const flavorExists = await flavorService.findFlavorById(id);
    if(!flavorExists) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: "Not flavor found.",
      });

      return;
    };

    const flavorUpdated = await flavorService.updateFlavor(id, updates);

    res.status(201).json({
      status: ServerStatusMessage.CREATED,
      msg: "Flavor updated successfully.",
      data: flavorUpdated,
    });
  } catch (error: any) {
    console.log("Error: ", error.message);
    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      error,
    });
  };
};

const deleteFlavor = async (req: Request, res: Response): Promise<void> => {
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
    const flavorExists = await flavorService.findFlavorById(id);
    if(!flavorExists) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: "Not flavor found.",
      });

      return;
    };

    await flavorService.deleteFlavor(id);

    res.status(200).json({
      status: ServerStatusMessage.OK,
      msg: "Flavor deleted successfully.",
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
  findFlavors,
  findFlavorById,
  createFlavor,
  updateFlavor,
  deleteFlavor,
};
