import { Request, Response } from "express";
import { deletePizzaImage, pagination, pizzasWithPrice, pizzaWithPrice, renamePizzaImage } from "@helpers";
import { FlavorRepository, PizzaRepository, SizeRepository } from "@repositories";
import { FlavorService, PizzaService, SizeService } from "@services";
import { APIResponse, IFlavorRepository, IFlavorService, IPizzaRepository, IPizzaService, ISizeRepository, ISizeService, PaginationModel, Pizza, ServerStatusMessage } from "@types";
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
    if (Object.values(query).length === 0) {
      const pizzas = await pizzaService.findPizzas();
      if (pizzas.length === 0) {
        res.status(404).json({
          status: ServerStatusMessage.NOT_FOUND,
          msg: "No pizzas found.",
        });
        
        return;
      };

      res.status(200).json({
        status: ServerStatusMessage.OK,
        data: {
          pizzas: pizzasWithPrice(pizzas),
          totalPizzas: pizzas.length,
          pizzasByPage: pizzas.length,
          currentPizzasQuantity: pizzas.length,
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
    const {
      items: pizzas,
      totalItems: totalPizzas,
      totalPages,
      currentPage,
      itemsByPage: pizzasByPage,
      currentItemsQuantity: currentPizzasQuantity,
    } = pizzasPaginated;

    /* Validate if there ins't pizzas. */
    if (pizzas.length === 0) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: "No pizzas found.",
      });
  
      return;
    };

    res.status(200).json({
      status: ServerStatusMessage.OK,
      data: {
        pizzas: pizzasWithPrice(pizzas),
        totalPizzas,
        pizzasByPage,
        currentPizzasQuantity,
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

const findPizzaById = async (req: Request, res: Response<APIResponse>): Promise<void> => {
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
    const pizza = await pizzaService.findPizzaById(id);
    if (!pizza) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: "Not pizza found.", 
      });

      return;
    };

    res.status(200).json({
      status: ServerStatusMessage.OK,
      data: pizzaWithPrice(pizza),
    });
  } catch (error: any) {
    console.log("Error: ", error.message);
    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      error,
    });
  };
};

const createPizza = async (req: Request, res: Response<APIResponse>): Promise<void> => {
  const { body, file } = req;
  const newPizza: Pizza = body;
  const { flavor } = newPizza;

  for(const key in newPizza) {
    if (String(newPizza[key as keyof Pizza]).trim().length === 0) {
      res.status(400).json({
        status: ServerStatusMessage.BAD_REQUEST,
        msg: "Fields can not be empty values.",
      });

      return;
    };
  };
  
  if (!flavor || !file) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "All fields are required.",
    });

    return;
  };
  
  /* Validate that flavor id be a valid id. */
  const flavorIdIsAValidId = isAValidId(flavor.toString());
  if (!flavorIdIsAValidId) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "Flavor id must to be a valid id.",
    });

    return;
  };

  try {
    /* Validate both flavor and default size ("Personal") be valid values. */
    const [flavorExists, sizeExists] = await Promise.all([
      flavorService.findFlavorById(flavor.toString()),
      sizeService.findSizeByName("Personal"),
    ]);
    if (!flavorExists || !sizeExists) {
      res.status(400).json({
        status: ServerStatusMessage.BAD_REQUEST,
        msg: "To create a new pizza is necessary a flavor and an existing size.",
      });

      return;
    };

    /* Validate if already exists a pizza with "newPizza" values. */
    const pizzaExists = await pizzaService.findPizza({
      $and: [
        { flavor: flavorExists.id },
        { size: sizeExists.id },
      ],
    });
    if (pizzaExists) {
      res.status(400).json({
        status: ServerStatusMessage.BAD_REQUEST,
        msg: `Already exists a pizza with '${flavorExists.name}' flavor.`,
      });
      deletePizzaImage(file.path);
      
      return;
    };
    
    const pizzaImageName: string = renamePizzaImage(file, flavorExists.name);
    const pizzaCreated = await pizzaService.createPizza({
      ...newPizza,
      flavor: flavorExists,
      size: sizeExists,
      image: pizzaImageName,
    });

    res.status(201).json({
      status: ServerStatusMessage.CREATED,
      msg: "Pizza created successfully.",
      data: pizzaCreated,
    });
  } catch (error: any) {
    console.log("Error: ", error.message);
    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      error,
    });
  };
};

const updatePizza = async (req: Request, res: Response<APIResponse>): Promise<void> => {
  const { params: { id }, file } = req;

  const validId = isAValidId(id);
  if (!validId) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "Invalid Id.",
    });

    return;
  };
  
  if (!file) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "Pizza image is required."
    });
    
    return;
  };

  try {
    const pizzaExists = await pizzaService.findPizzaById(id);
    if (!pizzaExists) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: "Not pizza found.",
      });

      return;
    };

    /* Delete current pizza image. */
    const { flavor, image } = pizzaExists;
    const pizzaImagePath: string = `${config.uploads.pizzas}/${image}`;
    deletePizzaImage(pizzaImagePath);

    /* Rename new pizza image. */
    const newPizzaImageName: string = renamePizzaImage(file, flavor.name);
    
    const updates = { image: newPizzaImageName };
    const pizzaUpdated = await pizzaService.updatePizza(id, updates);
    
    res.status(201).json({
      status: ServerStatusMessage.CREATED,
      msg: "Pizza updated successfully.",
      data: pizzaUpdated,
    });
  } catch (error: any) {
    console.log("Error: ", error.message),
    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      error,
    });
  };
};

const deletePizza = async (req: Request, res: Response<APIResponse>): Promise<void> => {
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
    const pizzaExists = await pizzaService.findPizzaById(id);
    if (!pizzaExists) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: "Not pizza found.",
      });

      return;
    };

    /* Delete pizza image. */
    const pizzaImagePath: string = `${config.uploads.pizzas}/${pizzaExists.image}`;
    deletePizzaImage(pizzaImagePath);
    
    await pizzaService.deletePizza(id);

    res.status(200).json({
      status: ServerStatusMessage.OK,
      msg: "Pizza deleted successfully.",
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
  findPizzas,
  findPizzaById,
  createPizza,
  updatePizza,
  deletePizza,
};
