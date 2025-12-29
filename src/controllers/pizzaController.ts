import { Request, Response } from "express";
import { deletePizzaImage, pagination, renamePizzaImage } from "@helpers";
import { FlavorRepository, PizzaRepository, SizeRepository } from "@repositories";
import { FlavorService, PizzaService, SizeService } from "@services";
import { APIResponse, Flavor, FlavorDoc, IFlavorRepository, IFlavorService, IPizzaRepository, IPizzaService, ISizeRepository, ISizeService, NewPizza, PaginationModel, Pizza, ServerStatusMessage } from "@types";
import { isAValidId } from "@utils";
import config from "@config/config";

const pizzaRepository: IPizzaRepository = new PizzaRepository();
const pizzaService: IPizzaService = new PizzaService(pizzaRepository);

const flavorRepository: IFlavorRepository = new FlavorRepository();
const flavorService: IFlavorService = new FlavorService(flavorRepository);

const sizeRepository: ISizeRepository = new SizeRepository();
const sizeService: ISizeService = new SizeService(sizeRepository);

const findPizzas = async (req: Request, res: Response<APIResponse>): Promise<void> => {
  const { query } = req;
  const page: number = Number(query.page);
  const limit: number = Number(query.limit);
  
  try {
    /* Validate if don't come "page" and "limit" in query params. */
    if (Object.values(query).length === 0) {
      /* Validate it there aren't pizzas registered. */
      const items = await pizzaService.findPizzas();
      if (items.length === 0) {
        res.status(200).json({
          status: ServerStatusMessage.OK,
          msg: "No pizzas found.",
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

    /* Get paginated pizzas. */
    const skip: number = (page - 1) * limit;
    const pizzasPaginated = await pagination({ model: PaginationModel.Pizzas, page, limit, skip });
    const { items, totalItems, totalPages, currentPage, itemsByPage, currentItemsQuantity } = pizzasPaginated;

    /* Validate if there aren't pizzas registered. */
    if (items.length === 0) {
      res.status(200).json({
        status: ServerStatusMessage.OK,
        msg: "No pizzas found.",
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

const findPizzaById = async (req: Request, res: Response<APIResponse>): Promise<void> => {
  const { id } = req.params;
  
  /* Validate that pizza id be a valid id. */
  const validId = isAValidId(id);
  if (!validId) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "Invalid Id.",
    });

    return;
  };
  
  try {
    /* Validate if pizza doesn't exist. */
    const pizzaExists = await pizzaService.findPizzaById(id);
    if (!pizzaExists) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: "Not pizza found.", 
      });

      return;
    };

    res.status(200).json({
      status: ServerStatusMessage.OK,
      data: pizzaExists,
    });
  } catch (error: any) {
    console.log(`Error: ${error.message}`);
    
    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      msg: error.message,
    });
  };
};

const createPizza = async (req: Request, res: Response<APIResponse>): Promise<void> => {
  const { body, file } = req;
  const newPizza: NewPizza = body;
  const { flavor } = newPizza;

  /* Validate that flavor and file exists in request. */
  if (!flavor || !file) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "All fields are required.",
    });
    deletePizzaImage(file!.path);
    
    return;
  };

  /* Validate that flavor be a valid Flavor id. */
  const flavorIdIsAValidId = isAValidId(flavor as string);
  if (!flavorIdIsAValidId) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "Flavor id must to be a valid id.",
    });
    deletePizzaImage(file.path);
    
    return;
  };

  try {
    /* Validate both flavor and default size for every pizza record ("Personal") be valid values. */
    const [flavorExists, sizeExists] = await Promise.all([
      flavorService.findFlavorById(flavor as string),
      sizeService.findSizeByName("Personal"),
    ]);
    if (!flavorExists || !sizeExists) {
      res.status(400).json({
        status: ServerStatusMessage.BAD_REQUEST,
        msg: "To create a new pizza record is necessary an existing Flavor and Size.",
      });
      deletePizzaImage(file.path);

      return;
    };

    /* Validate if already exists a pizza with same flavor name. */
    const pizzaExists = await pizzaService.findPizza({
      flavor: (flavorExists as FlavorDoc)._id,
    });
    if (pizzaExists) {
      res.status(409).json({
        status: ServerStatusMessage.CONFLICT,
        msg: `Already exists a pizza with '${flavorExists.name}' flavor.`,
      });
      deletePizzaImage(file.path);
      
      return;
    };
    
    /* Create pizza. */
    const pizzaImageName: string = renamePizzaImage(file, flavorExists.name);
    const pizzaCreated = await pizzaService.createPizza({
      flavor: flavorExists,
      size: sizeExists,
      price: flavorExists.price + sizeExists.price,
      image: pizzaImageName,
    });

    res.status(201).json({
      status: ServerStatusMessage.CREATED,
      msg: "Pizza created successfully.",
      data: pizzaCreated,
    });
  } catch (error: any) {
    console.log(`Error: ${error.message}`);
    
    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      msg: error.message,
    });
  };
};

const updatePizza = async (req: Request, res: Response<APIResponse>): Promise<void> => {
  const { params: { id }, file } = req;

  /* Validate if don't come pizza image in request. */
  if (!file) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "Pizza image is required."
    });
    
    return;
  };

  /* Validate that pizza id be a valid id. */
  const validId = isAValidId(id);
  if (!validId) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "Invalid Id.",
    });
    deletePizzaImage(file.path);

    return;
  };

  try {
    /* Validate if pizza doesn't exist. */
    const pizzaExists = await pizzaService.findPizzaById(id);
    if (!pizzaExists) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: "Not pizza found.",
      });
      deletePizzaImage(file.path);

      return;
    };

    /* Delete current pizza image. */
    const { flavor, image } = pizzaExists;
    const pizzaImagePath: string = `${config.uploads.pizzas}/${image}`;
    deletePizzaImage(pizzaImagePath);
    
    /* Rename new pizza image. */
    const newPizzaImageName: string = renamePizzaImage(file, (flavor as Flavor).name);
    
    /* Update pizza. */
    const updates: Partial<Pizza> = { image: newPizzaImageName };
    const pizzaUpdated = await pizzaService.updatePizza(id, updates);
    
    res.status(200).json({
      status: ServerStatusMessage.OK,
      msg: "Pizza updated successfully.",
      data: pizzaUpdated,
    });
  } catch (error: any) {
    console.log(`Error: ${error.message}`),
    
    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      msg: error.message,
    });
  };
};

const deletePizza = async (req: Request, res: Response<APIResponse>): Promise<void> => {
  const { id } = req.params;

  /* Validate that pizza id be a valid id. */
  const validId = isAValidId(id);
  if (!validId) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "Invalid Id.",
    });

    return;
  };

  try {
    /* Validate if pizza doesn't exist. */
    const pizzaExists = await pizzaService.findPizzaById(id);
    if (!pizzaExists) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: "Not pizza found.",
      });

      return;
    };

    /* Delete pizza. */
    const pizzaImagePath: string = `${config.uploads.pizzas}/${pizzaExists.image}`;
    deletePizzaImage(pizzaImagePath);
    await pizzaService.deletePizza(id);

    res.status(200).json({
      status: ServerStatusMessage.DELETED,
      msg: "Pizza deleted successfully.",
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
  findPizzas,
  findPizzaById,
  createPizza,
  updatePizza,
  deletePizza,
};
