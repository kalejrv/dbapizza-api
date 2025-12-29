import { Request, Response } from "express";
import { FlavorRepository } from "@repositories";
import { FlavorService } from "@services";
import { APIResponse, Flavor, FlavorDoc, IFlavorRepository, IFlavorService, ServerStatusMessage } from "@types";
import { isAValidId } from "@utils";

const flavorRepository: IFlavorRepository = new FlavorRepository();
const flavorService: IFlavorService = new FlavorService(flavorRepository);

const findFlavors = async (_req: Request, res: Response<APIResponse>): Promise<void> => {
  try {
    /* Validate if there aren't flavors registered.  */
    const flavors = await flavorService.findFlavors();
    if (flavors.length === 0) {
      res.status(200).json({
        status: ServerStatusMessage.OK,
        msg: "No flavors yet.",
      });

      return;
    };

    res.status(200).json({
      status: ServerStatusMessage.OK,
      data: flavors,
    });
  } catch (error: any) {
    console.log(`Error: ${error.message}`);
    
    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      msg: error.message,
    });
  };
};

const findFlavorById = async (req: Request, res: Response<APIResponse>): Promise<void> => {
  const { id } = req.params;
  
  /* Validate that flavor id be a valid id. */
  const validId = isAValidId(id);
  if (!validId) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "Invalid Id.",
    });

    return;
  };
  
  try {
    /* Validate if flavor don't exists. */
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
    console.log(`Error: ${error.message}`);
    
    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      msg: error.message,
    });
  };
};

const createFlavor = async (req: Request, res: Response<APIResponse>): Promise<void> => {
  const newFlavor: Flavor = req.body;
  const { name, description, price } = newFlavor;

  /* Validate that values don't be empty values. */
  for (const key in newFlavor) {
    const value = newFlavor[key as keyof Flavor];

    if ((typeof value === "string") && value.trim().length === 0) {
      res.status(400).json({
        status: ServerStatusMessage.BAD_REQUEST,
        msg: "Fields can not be empty values.",
      });

      return;
    };
  };

  /* Validate that all Flavor values come in request. */
  if ((Object.values(newFlavor).length === 0) || !name || !description || !price) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "All fields are required.",
    });

    return;
  };

  try {
    /* Validate that if already exists a flavor with same name don't save it. */
    const flavorExists = await flavorService.findFlavorByName(name);
    if (flavorExists) {
      res.status(409).json({
        status: ServerStatusMessage.CONFLICT,
        msg: `Already exists a flavor with name: ${flavorExists.name}.`, 
      });

      return;
    };

    /* Create flavor record and save it. */
    const flavor = await flavorService.createFlavor({
      ...newFlavor,
      price: Number(price),
    });
    
    res.status(201).json({
      status: ServerStatusMessage.CREATED,
      msg: "Flavor created successfully.",
      data: flavor,
    });
  } catch (error: any) {
    console.log(`Error: ${error.message}`);
    
    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      msg: error.message,
    });
  };
};

const updateFlavor = async (req: Request, res: Response<APIResponse>): Promise<void> => {
  const { params: { id }, body } = req;
  const updates: Partial<Flavor> = body;

  /* Validate that flavor id be a valid id. */
  const validId = isAValidId(id);
  if (!validId) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "Invalid Id.",
    });

    return;
  };

  /* Validate that updates don't be empty values. */
  for (const key in updates) {
    if (String(updates[key as keyof Flavor]).trim().length === 0) {
      res.status(400).json({
        status: ServerStatusMessage.BAD_REQUEST,
        msg: "Updates can not be empty values.",
      });

      return;
    };
  };
  
  /* Validate that come at least one update in request. */
  if ((Object.values(updates).length === 0)) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "Updates are required.",
    });

    return;
  };

  try {
    /* Validate that if flavor don't exists updates can not be applied. */
    const flavorExists = await flavorService.findFlavorById(id) as FlavorDoc;
    if(!flavorExists) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: "Not flavor found.",
      });

      return;
    };

    /* Validate that if already exists a flavor with same name don't update it. */
    if (updates.name) {
      const flavorWithSameNameExists = await flavorService.findFlavorByName(updates.name) as FlavorDoc;
      if (flavorWithSameNameExists && (flavorWithSameNameExists.id !== flavorExists.id)) {
        res.status(409).json({
          status: ServerStatusMessage.CONFLICT,
          msg: `Already exists a flavor with name: ${updates.name}.`,
        });
        
        return;
      };
    };

    /* Update flavor. */
    const flavorUpdated = await flavorService.updateFlavor(id, updates);

    res.status(200).json({
      status: ServerStatusMessage.UPDATED,
      msg: "Flavor updated successfully.",
      data: flavorUpdated,
    });
  } catch (error: any) {
    console.log(`Error: ${error.message}`);
    
    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      msg: error.message,
    });
  };
};

const deleteFlavor = async (req: Request, res: Response<APIResponse>): Promise<void> => {
  const { id } = req.params;

  /* Validate that flavor id be a valid id. */
  const validId = isAValidId(id);
  if (!validId) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "Invalid Id.",
    });
    
    return;
  };

  try {
    /* Validate that if flavor don't exists isn't possible delete it. */
    const flavorExists = await flavorService.findFlavorById(id);
    if(!flavorExists) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: "Not flavor found.",
      });

      return;
    };

    /* Delete flavor. */
    await flavorService.deleteFlavor(id);

    res.status(200).json({
      status: ServerStatusMessage.OK,
      msg: "Flavor deleted successfully.",
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
  findFlavors,
  findFlavorById,
  createFlavor,
  updateFlavor,
  deleteFlavor,
};
