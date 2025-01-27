import { toppingsPagination } from "@helpers";
import { ToppingRepository } from "@repositories";
import { ToppingService } from "@services";
import { IToppingRepository, IToppingService, ServerStatusMessage, Topping } from "@types";
import { isAValidId } from "@utils";
import { Request, Response } from "express";

const toppingRepository: IToppingRepository = new ToppingRepository();
const toppingService: IToppingService = new ToppingService(toppingRepository);

const findToppings = async (req: Request, res: Response): Promise<void> => {
  const { query } = req;

  const page: number = Number(query.page);
  const limit: number = Number(query.limit);
  const skip: number = (page - 1) * limit;

  try {
    if (Object.values(query).length === 0) {
      const toppings = await toppingService.findToppings();
      
      if (toppings.length === 0) {
        res.status(404).json({
          status: ServerStatusMessage.NOT_FOUND,
          msg: "No topping found.",
        });
  
        return;
      };

      res.status(200).json({
        status: ServerStatusMessage.OK,
        data: toppings,
      });

      return;
    };

    const toppingsPaginated = await toppingsPagination(skip, limit);
    const { toppings, totalPages, totalToppings } = toppingsPaginated;

    if (toppings.length === 0) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: "No topping found.",
      });

      return;
    };

    res.status(200).json({
      status: ServerStatusMessage.OK,
      data: {
        toppings,
        totalToppings,
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

const findToppingById = async (req: Request, res: Response): Promise<void> => {
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

const createTopping = async (req: Request, res: Response): Promise<void> => {
  const newTopping: Topping = req.body;
  
  for (const el of Object.values(newTopping)) {
    if (String(el).trim().length === 0) {
      res.status(400).json({
        status: ServerStatusMessage.BAD_REQUEST,
        msg: "Topping fields can not be empty values.",
      });

      return;
    };
  };

  const { name, price } = newTopping;
  if ((Object.values(newTopping).length === 0) || !name || !price) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "All fields are required.",
    });

    return;
  }

  try {
    const toppingExists = await toppingService.findToppingByName(name);
    if (toppingExists) {
      res.status(400).json({
        status: ServerStatusMessage.BAD_REQUEST,
        msg: `Already exists a topping with name: ${toppingExists.name}.`, 
      });

      return;
    };

    const topping = await toppingService.createTopping({...newTopping, price: Number(price)});
    
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

const updateTopping = async (req: Request, res: Response): Promise<void> => {
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
      msg: "All topping fields are required.",
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

const deleteTopping = async (req: Request, res: Response): Promise<void> => {
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
