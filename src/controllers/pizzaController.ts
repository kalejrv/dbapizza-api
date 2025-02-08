import { deletePizzaImage, pizzasPagination, pizzasWithPrice, pizzaWithPrice, renamePizzaImage } from "@helpers";
import { FlavorRepository, PizzaRepository, SizeRepository } from "@repositories";
import { FlavorService, PizzaService, SizeService } from "@services";
import { IFlavorRepository, IFlavorService, IPizzaRepository, IPizzaService, ISizeRepository, ISizeService, Pizza, ServerStatusMessage } from "@types";
import { isAValidId, isAValidNumber } from "@utils";
import { Request, Response } from "express";

const pizzaRepository: IPizzaRepository = new PizzaRepository();
const pizzaService: IPizzaService = new PizzaService(pizzaRepository);

const flavorRepository: IFlavorRepository = new FlavorRepository();
const flavorService: IFlavorService = new FlavorService(flavorRepository);

const sizeRepository: ISizeRepository = new SizeRepository();
const sizeService: ISizeService = new SizeService(sizeRepository);

const findPizzas = async (req: Request, res: Response): Promise<void> => {
  const { query } = req;

  try {
    if (Object.values(query).length === 0) {
      const pizzas = await pizzaService.findPizzas();
      if (pizzas.length === 0) {
        res.status(404).json({
          status: ServerStatusMessage.NOT_FOUND,
          msg: "No pizza found.",
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

    const pageIsAValidNumber: boolean = isAValidNumber(query.page as string);
    const limitIsAValidNumber: boolean = isAValidNumber(query.limit as string);

    if (!pageIsAValidNumber || !limitIsAValidNumber) {
      res.status(400).json({
        status: ServerStatusMessage.BAD_REQUEST,
        msg: "Page and Limit values can not to be diferent of a valid number.",
      });

      return;
    };

    const page: number = Number(query.page);
    const limit: number = Number(query.limit);
    const skip: number = (page - 1) * limit;

    if ((page === 0) || (limit === 0)) {
      res.status(400).json({
        status: ServerStatusMessage.BAD_REQUEST,
        msg: "Page and Limit values can no to be equal to zero.",
      });

      return;
    };

    const paginatedPizzas = await pizzasPagination({ skip, limit, page });
    const { pizzas, totalPizzas, totalPages, currentPage, pizzasByPage, currentPizzasQuantity } = paginatedPizzas;

    if (pizzas.length === 0) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: "No pizza found.",
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

const findPizzaById = async (req: Request, res: Response): Promise<void> => {
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

const createPizza = async (req: Request, res: Response): Promise<void> => {
  const { body, file } = req;
  const newPizza: Pizza = body;

  for(const el of Object.values(newPizza)) {
    if (String(el).trim().length === 0) {
      res.status(400).json({
        status: ServerStatusMessage.BAD_REQUEST,
        msg: "Fields can not be empty values.",
      });

      return;
    };
  };

  const { flavor, size } = newPizza;
  if (!flavor || !size || !file) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "All fields are required.",
    });

    return;
  };

  const flavorIdOfNewPizza = String(flavor);
  const sizeIdOfNewPizza = String(size);

  const flavorIdIsAValidId = isAValidId(flavorIdOfNewPizza);
  const sizeIdIsAValidId = isAValidId(sizeIdOfNewPizza);
  if (!flavorIdIsAValidId || !sizeIdIsAValidId) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "Flavor and Size id's must to be a valid id.",
    });

    return;
  };

  try {
    const flavorExists = await flavorService.findFlavorById(flavorIdOfNewPizza);
    const sizeExists = await sizeService.findSizeById(sizeIdOfNewPizza);
    if (!flavorExists || !sizeExists) {
      res.status(400).json({
        status: ServerStatusMessage.BAD_REQUEST,
        msg: "To create a new pizza is necessary a flavor and size existing.",
      });

      return;
    };
    
    const pizzaExists = await pizzaService.findPizza({
      $and: [
        { flavor: flavorExists?._id.toString() },
        { size: sizeExists?._id.toString() },
      ],
    });
    if (pizzaExists) {
      res.status(400).json({
        status: ServerStatusMessage.BAD_REQUEST,
        msg: `Already exists a pizza with ${flavorExists?.name} flavor and ${sizeExists?.name} size.`,
      });
      deletePizzaImage(file.path);
      
      return;
    };

    const pizzaImageName: string = renamePizzaImage(file, flavorExists.name, sizeExists.name);
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

const updatePizza = async (req: Request, res: Response): Promise<void> => {
  const { params: { id }, file } = req;

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

    const { flavor, size, image } = pizzaExists;
    const pizzaImagePath: string = `uploads/pizzas/${image}`;
    deletePizzaImage(pizzaImagePath);

    const newPizzaImageName: string = renamePizzaImage(file, flavor.name, size.name);
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

const deletePizza = async (req: Request, res: Response): Promise<void> => {
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

    const pizzaImagePath: string = `uploads/pizzas/${pizzaExists.image}`;
    deletePizzaImage(pizzaImagePath);
    pizzaService.deletePizza(id);

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
