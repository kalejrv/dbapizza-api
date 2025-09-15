import { Request, Response } from "express";
import { pagination } from "@helpers";
import { ToppingRepository } from "@repositories";
import { ToppingService } from "@services";
import { APIResponse, IToppingRepository, IToppingService, PaginationModel, ServerStatusMessage, Topping } from "@types";
import { isAValidId } from "@utils";

const toppingRepository: IToppingRepository = new ToppingRepository();
const toppingService: IToppingService = new ToppingService(toppingRepository);

const findToppings = async (req: Request, res: Response<APIResponse>): Promise<void> => {
  const { query } = req;
  const page: number = Number(query.page);
  const limit: number = Number(query.limit);

  try {
    if (Object.values(query).length === 0) {
      const toppings = await toppingService.findToppings();
      if (toppings.length === 0) {
        res.status(404).json({
          status: ServerStatusMessage.NOT_FOUND,
          msg: "No toppings found.",
        });
  
        return;
      };

      res.status(200).json({
        status: ServerStatusMessage.OK,
        data: {
          toppings,
          totalToppings: toppings.length,
          toppingsByPage: toppings.length,
          currentToppingsQuantity: toppings.length,
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
    const {
      items: toppings,
      totalItems: totalToppings,
      itemsByPage: toppingsByPage,
      currentItemsQuantity: currentToppingsQuantity,
      currentPage,
      totalPages,
    } = toppingsPaginated;

    /* Validate if there isn't toppings. */
    if (toppings.length === 0) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: "No toppings found.",
      });

      return;
    };

    res.status(200).json({
      status: ServerStatusMessage.OK,
      data: {
        toppings,
        totalToppings,
        toppingsByPage,
        currentToppingsQuantity,
        currentPage,
        totalPages,
      },
    });
  } catch (error: any) {
    console.log("Error: ", error.message);
    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      error,
    });
  };
};

const findToppingById = async (req: Request, res: Response<APIResponse>): Promise<void> => {
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
    console.log("Error: ", error.message);
    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      error,
    });
  };
};

const createTopping = async (req: Request, res: Response<APIResponse>): Promise<void> => {
  const newTopping: Topping = req.body;
  const { name, price } = newTopping;

  for (const key in newTopping) {
    if (String(newTopping[key as keyof Topping]).trim().length === 0) {
      res.status(400).json({
        status: ServerStatusMessage.BAD_REQUEST,
        msg: "Fields can not be empty values.",
      });
    
      return;
    };
  };
  
  if ((Object.values(newTopping).length === 0) || !name || !price) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "All fields are required.",
    });

    return;
  };

  try {
    const toppingExists = await toppingService.findToppingByName(name);
    if (toppingExists) {
      res.status(400).json({
        status: ServerStatusMessage.BAD_REQUEST,
        msg: `Already exists a topping with name: ${toppingExists.name}.`, 
      });

      return;
    };

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
    console.log("Error: ", error.message);
    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      error,
    });
  };
};

const updateTopping = async (req: Request, res: Response<APIResponse>): Promise<void> => {
  const { params: { id }, body } = req;
  const updates: Partial<Topping> = body;

  const validId = isAValidId(id);
  if (!validId) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "Invalid Id.",
    });

    return;
  };

  for (const key in updates) {
    if (String(updates[key as keyof Topping]).trim().length === 0) {
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
    const toppingExists = await toppingService.findToppingById(id);
    if(!toppingExists) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: "Not topping found.",
      });

      return;
    };
    
    const toppingUpdated = await toppingService.updateTopping(id, updates);

    res.status(201).json({
      status: ServerStatusMessage.CREATED,
      msg: "Topping updated successfully.",
      data: toppingUpdated,
    });
  } catch (error: any) {
    console.log("Error: ", error.message);
    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      error,
    });
  };
};

const deleteTopping = async (req: Request, res: Response<APIResponse>): Promise<void> => {
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
    const toppingExists = await toppingService.findToppingById(id);
    if(!toppingExists) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: "Not topping found.",
      });

      return;
    };

    await toppingService.deleteTopping(id);

    res.status(200).json({
      status: ServerStatusMessage.OK,
      msg: "Topping deleted successfully.",
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
  findToppings,
  findToppingById,
  createTopping,
  updateTopping,
  deleteTopping,
};
