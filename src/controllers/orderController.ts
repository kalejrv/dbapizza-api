import { Request, Response } from "express";
import { calculateTotalOrder, formatOrderItems, pagination } from "@helpers";
import { OrderRepository, StatusRepository } from "@repositories";
import { OrderService, StatusService } from "@services";
import { APIResponse, IOrderRepository, IOrderService, IStatusRepository, IStatusService, Item, Order, OrderItem, OrderUser, PaginationModel, ServerStatusMessage, Status, StatusOption } from "@types";
import { isAValidId } from "@utils";

const orderRepository: IOrderRepository = new OrderRepository;
const orderService: IOrderService = new OrderService(orderRepository);

const statusRepository: IStatusRepository = new StatusRepository;
const statusService: IStatusService = new StatusService(statusRepository);

const findOrders = async (req: Request, res: Response<APIResponse>): Promise<void> => { 
  const { query } = req;
  const page: number = Number(query.page);
  const limit: number = Number(query.limit);
  
  try {
    if (Object.values(query).length === 0) {
      const orders = await orderService.findOrders();
      if (orders.length === 0) {
        res.status(404).json({
          status: ServerStatusMessage.NOT_FOUND,
          msg: "No orders found.",
        });

        return;
      };
  
      res.status(200).json({
        status: ServerStatusMessage.OK,
        data: {
          orders,
          totalOrders: orders.length,
          ordersByPage: orders.length,
          currentOrdersQuantity: orders.length,
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
    
    /* Get paginated orders. */
    const skip: number = (page - 1) * limit;
    const paginatedOrders = await pagination({ model: PaginationModel.Orders, page, limit, skip });
    const {
      items: orders,
      totalItems: totalOrders,
      itemsByPage: ordersByPage,
      currentItemsQuantity: currentOrdersQuantity,
      currentPage,
      totalPages,
    } = paginatedOrders;

    /* Validate if there isn't orders. */
    if (orders.length === 0) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: "No orders found.",
      });

      return;
    };

    res.status(200).json({
      status: ServerStatusMessage.OK,
      data: {
        orders,
        totalOrders,
        ordersByPage,
        currentOrdersQuantity,
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

const findOrderById = async (req: Request, res: Response<APIResponse>): Promise<void> => {
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
    const order = await orderService.findOrderById(id);
    if (!order) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: "Not order found.",
      });

      return;
    };

    res.status(200).json({
      status: ServerStatusMessage.OK,
      data: order,
    });
  } catch (error: any) {
    console.log("Error: ", error.message);
    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      error,
    });
  };
};

const createOrder = async (req: Request, res: Response<APIResponse>): Promise<void> => {
  const { userAuth, body } = req;
  const { firstName, lastName, address, phone, email } = userAuth;
  const newOrder: Item[] = body;
   
  /* Validate that items don't contain properties with empty values. */
  for (const item of newOrder) {
    for (const key in item) {
      if ((key !== "toppings") && String(item[key as keyof Item]).trim().length === 0) {
        res.status(400).json({
          status: ServerStatusMessage.BAD_REQUEST,
          msg: "Item fields are required.",
        });

        return;
      };
    };
  };
  
  /* Validate that items don't come empties. */
  for (const item of newOrder) {
    if (Object.values(item).length === 0) {
      res.status(400).json({
        status: ServerStatusMessage.BAD_REQUEST,
        msg: "Item can not be an empty value.",
      });

      return;
    };
  };

  /* Validate that new order don't come empty. */
  if (newOrder.length === 0) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "At least 1 item is required.",
    });

    return;  
  };

  /* Validate that all required fields don't be an empty value. */
  for (const item of newOrder) {
    const { pizza, size, quantity } = item;

    if (!pizza || !size || !quantity) {
      res.status(400).json({
        status: ServerStatusMessage.BAD_REQUEST,
        msg: "A pizza, size and a quantity are required.",
      });
            
      return;
    };
  };

  try {
    /* Build order. */
    const user: OrderUser = { firstName, lastName, address, phone, email };
    const items: OrderItem[] = await formatOrderItems(newOrder);
    const status: Status = await statusService.findStatusByName("Pending") as Status;
    const total: number = calculateTotalOrder(items);

    const orderCreated: Order = await orderService.createOrder({ user, items, status, total });

    res.status(201).json({
      status: ServerStatusMessage.CREATED,
      msg: "Order created successfully.",
      data: orderCreated,
    });
  } catch (error: any) {
    console.log("Error: ", error.message);
    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      error,
    });
  };
};

const updateOrder = async (req: Request, res: Response<APIResponse>): Promise<void> => {
  const { id } = req.params;
  const updates = req.body;

  const validId = isAValidId(id);
  if (!validId) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "Invalid Id.",
    });

    return;
  };

  try {
    const [orderExists, statusExists] = await Promise.all([
      orderService.findOrderById(id),
      statusRepository.findById(updates.status),
    ]);

    if (!orderExists) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: "Not order found.",
      });

      return;
    };

    /* Avoid cancel an order if its status is set as "In progress" or "Done". */
    if (statusExists!.name === StatusOption["Cancelled"] && (orderExists.status.name === StatusOption["InProgress"] || orderExists.status.name === StatusOption["Done"])) {
      res.status(400).json({
        status: ServerStatusMessage.BAD_REQUEST,
        msg: "The order can not to be cancelled.",
      });

      return;
    };
    
    /* Avoid change order status if already has been set as "Cancelled". */
    if (statusExists!.name !== StatusOption["Cancelled"] && orderExists.status.name === StatusOption["Cancelled"]) {
      res.status(200).json({
        status: ServerStatusMessage.OK,
        msg: "The order already has been cancelled.",
      });

      return;
    };

    /* Avoid set status to "Pending" to an order that has status "In progress", "Done" or "Cancelled". */
    if (statusExists!.name === StatusOption["Pending"] && orderExists.status.name !== StatusOption["Pending"]) {
      res.status(400).json({
        status: ServerStatusMessage.BAD_REQUEST,
        msg: "The order can no longer be changed to Pending.",
      });

      return;
    };
    
    /* Avoid change order status if already has been set as "Done". */
    if (statusExists!.name !== StatusOption["Done"] && orderExists.status.name === StatusOption["Done"]) {
      res.status(400).json({
        status: ServerStatusMessage.BAD_REQUEST,
        msg: "The order can no longer change its status because already is Done.",
      });

      return;
    };

    const orderUpdated = await orderService.updateOrder(id, updates) as Order;

    res.status(201).json({
      status: ServerStatusMessage.CREATED,
      msg: "Order updated successfully.",
      data: orderUpdated,
    });
  } catch (error: any) {
    console.log("Error: ", error.message);
    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      error,
    });
  };
};

const deleteOrder = async (req: Request, res: Response<APIResponse>): Promise<void> => {
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
    const orderExists = await orderService.findOrderById(id);
    if (!orderExists) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: "Not order found.",
      });

      return;
    };

    await orderService.deleteOrder(id);

    res.status(200).json({
      status: ServerStatusMessage.OK,
      msg: "Order deleted successfully.",
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
  findOrders,
  findOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
};
