import { Request, Response } from "express";
import { pagination } from "@helpers";
import { ToppingRepository } from "@repositories";
import { ToppingService } from "@services";
import { APIResponse, IToppingRepository, IToppingService, PaginationModel, ServerStatusMessage, Topping, ToppingDoc } from "@types";
import { isAValidId } from "@utils";

const toppingRepository: IToppingRepository = new ToppingRepository();
const toppingService: IToppingService = new ToppingService(toppingRepository);

const findToppings = async (req: Request, res: Response<APIResponse>): Promise<void> => {
  const { query } = req;
  const page: number = Number(query.page);
  const limit: number = Number(query.limit);

  try {
    /* Validate if query values don't come in request. */
    if (Object.values(query).length === 0) {
      /* Validate if there aren't any topping registed. */
      const items = await toppingService.findToppings();
      if (items.length === 0) {
        res.status(200).json({
          status: ServerStatusMessage.OK,
          msg: "No toppings yet.",
          data: {
            items,
            totalItems: items.length,
          },
        });

        return;
      };

      res.status(200).json({
        status: ServerStatusMessage.OK,
        data: {
          items,
          totalItems: items.length,
          itemsByPage: items.length,
          currentItemsQuantity: items.length,
          currentPage: 1,
          totalPages: 1,
        },
      });

      return;
    };

    /* Validate that page and limit query params be valid values. */
    if ((!page || (page < 0)) || (!limit || limit < 0)) {
      res.status(400).json({
        status: ServerStatusMessage.BAD_REQUEST,
        msg: "Page and limit query params are required as valid number values.",
      });

      return;
    };

    /* Get paginated toppings. */
    const skip: number = (page - 1) * limit;
    const toppingsPaginated = await pagination({ model: PaginationModel.Toppings, page, limit, skip });
    const { items, totalItems, itemsByPage, currentItemsQuantity, currentPage, totalPages } = toppingsPaginated;

    /* Validate if there aren't toppings registered. */
    if (items.length === 0) {
      res.status(200).json({
        status: ServerStatusMessage.OK,
        msg: "No toppings yet.",
        data: {
          items,
          totalItems: items.length,
        },
      });

      return;
    };

    res.status(200).json({
      status: ServerStatusMessage.OK,
      data: {
        items,
        totalItems,
        itemsByPage,
        currentItemsQuantity,
        currentPage,
        totalPages,
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

const findToppingById = async (req: Request, res: Response<APIResponse>): Promise<void> => {
  const { id } = req.params;
  
  /* Validate that topping id be a valid id. */
  const validId = isAValidId(id);
  if (!validId) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "Invalid Id.",
    });

    return;
  };
  
  try {
    /* Validate if topping doesn't exists. */
    const topping = await toppingService.findToppingById(id);
    if (!topping) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: "Not topping found.", 
      });

      return;
    };

    res.status(200).json({
      status: ServerStatusMessage.OK,
      data: topping,
    });
  } catch (error: any) {
    console.log(`Error: ${error.message}`);
    
    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      msg: error.message,
    });
  };
};

const createTopping = async (req: Request, res: Response<APIResponse>): Promise<void> => {
  const newTopping: Topping = req.body;
  const { name, price } = newTopping;

  /* Validate that values from request don't be empty values. */
  for (const key in newTopping) {
    if (String(newTopping[key as keyof Topping]).trim().length === 0) {
      res.status(400).json({
        status: ServerStatusMessage.BAD_REQUEST,
        msg: "Fields can not be empty values.",
      });
    
      return;
    };
  };
  
  /* Validate that come all required values to create a new topping. */
  if ((Object.values(newTopping).length === 0) || !name || !price) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "All fields are required.",
    });

    return;
  };

  try {
    /* Validate that if already exists a topping with same name don't save it. */
    const toppingExists = await toppingService.findToppingByName(name);
    if (toppingExists) {
      res.status(409).json({
        status: ServerStatusMessage.CONFLICT,
        msg: `Already exists a topping with name: ${toppingExists.name}.`, 
      });

      return;
    };
    
    /* Create topping. */
    const topping = await toppingService.createTopping({
      ...newTopping,
      price: Number(price),
    });
    
    res.status(201).json({
      status: ServerStatusMessage.CREATED,
      msg: "Topping created successfully.",
      data: topping,
    });
  } catch (error: any) {
    console.log(`Error: ${error.message}`);
    
    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      msg: error.message,
    });
  };
};

const updateTopping = async (req: Request, res: Response<APIResponse>): Promise<void> => {
  const { params: { id }, body } = req;
  const updates: Partial<Topping> = body;

  /* Validate that topping id be a valid id. */
  const validId = isAValidId(id);
  if (!validId) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "Invalid Id.",
    });

    return;
  };

  /* Validate that update values don't be empty values. */
  for (const key in updates) {
    if (String(updates[key as keyof Topping]).trim().length === 0) {
      res.status(400).json({
        status: ServerStatusMessage.BAD_REQUEST,
        msg: "Udpates can not be empty values.",
      });

      return;
    };
  };
  
  /* Validate that come at least one update in request. */
  if (Object.values(updates).length === 0) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "At least one update is required.",
    });

    return;
  };

  try {
    /* Validate that if topping doesn't exists isn't possible to update it. */
    const toppingExists = await toppingService.findToppingById(id) as ToppingDoc;
    if(!toppingExists) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: "Not topping found.",
      });

      return;
    };
    
    /* Validate that if already exists a topping with same name don't update it. */
    if (updates.name) {
      const toppingWithSameName = await toppingService.findToppingByName(updates.name) as ToppingDoc;
      if (toppingWithSameName && (toppingWithSameName.id !== toppingExists.id)) {
        res.status(409).json({
          status: ServerStatusMessage.CONFLICT,
          msg: `Already exists a topping with name: ${updates.name}.`,
        });

        return;
      };
    };
    
    /* Update topping. */
    const toppingUpdated = await toppingService.updateTopping(id, updates);

    res.status(200).json({
      status: ServerStatusMessage.UPDATED,
      msg: "Topping updated successfully.",
      data: toppingUpdated,
    });
  } catch (error: any) {
    console.log(`Error: ${error.message}`);
    
    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      msg: error.message,
    });
  };
};

const deleteTopping = async (req: Request, res: Response<APIResponse>): Promise<void> => {
  const { id } = req.params;

  /* Validate that topping id be a valid id. */
  const validId = isAValidId(id);
  if (!validId) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "Invalid Id.",
    });

    return;
  };

  try {
    /* Validate that if topping doesn't exists isn't possible to delete it. */
    const toppingExists = await toppingService.findToppingById(id);
    if(!toppingExists) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: "Not topping found.",
      });

      return;
    };

    /* Delete topping. */
    await toppingService.deleteTopping(id);

    res.status(200).json({
      status: ServerStatusMessage.DELETED,
      msg: "Topping deleted successfully.",
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
  findToppings,
  findToppingById,
  createTopping,
  updateTopping,
  deleteTopping,
};
