import { Request, Response } from "express";
import { calculateItemsGrowthRate, calculateSalesRate, calculateTotalOrder, formatOrderItems, pagination } from "@helpers";
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
      const items = await orderService.findOrders();
      if (items.length === 0) {
        res.status(404).json({
          status: ServerStatusMessage.NOT_FOUND,
          msg: "No orders found.",
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
    
    /* Get paginated orders. */
    const skip: number = (page - 1) * limit;
    const paginatedOrders = await pagination({ model: PaginationModel.Orders, page, limit, skip });
    const { items, totalItems, itemsByPage, currentItemsQuantity, currentPage, totalPages } = paginatedOrders;

    /* Validate if there isn't orders. */
    if (items.length === 0) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
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
    console.log("Error: ", error.message);
    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      msg: error.message,
    });
  };
};

const findOrdersStatsByMonth = async (req: Request, res: Response<APIResponse>): Promise<void> => {
  const { query } = req;
  const year: number = Number(query.year);
  const month: number = Number(query.month);

  if (!year || !month) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "A valid year and month is required.",
    });

    return;
  };

  /* Build current month dates range. */
  const startOfCurrentMonth = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
  const endOfCurrentMonth = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

  /* Build last month dates range. */
  const startOfLastMonth = new Date(Date.UTC(year, month - 2, 1, 0, 0, 0, 0));
  const endOfLasMonth = new Date(Date.UTC(year, month - 1, 0, 23, 59, 59, 999));

  try {
    const [currentMonthItems, lastMonthItems, totalItems] = await Promise.all([
      orderService.findOrders({
        createdAt: {
          $gte: startOfCurrentMonth,
          $lte: endOfCurrentMonth,
        },
      }),
      orderService.findOrders({
        createdAt: {
          $gte: startOfLastMonth,
          $lte: endOfLasMonth,
        },
      }),
      orderService.findOrders(),
    ]);

    /* Calculate month items growth rate. */
    const { currentMonthItemsCount, lastMonthItemsCount, itemsGrowthRate } = calculateItemsGrowthRate({
      currentMonthItemsCount: currentMonthItems.length,
      lastMonthItemsCount: lastMonthItems.length,
    });
    
    /* Calculate month sales growth rate. */
    const { currentMonthSalesAmount, lastMonthSalesAmount, salesGrowthRate } = calculateSalesRate({
      currentMonthItems,
      lastMonthItems,
    });
    
    /* Calculate total sales. */
    const totalSalesAmount = totalItems.reduce((prev, curr): number => prev += curr.total, 0);
    
    res.status(200).json({
      status: ServerStatusMessage.OK,
      data: {
        year,
        month,
        items: {
          currentMonthItemsCount,
          lastMonthItemsCount,
          itemsGrowthRate,
          totalItemsCount: totalItems.length,
        },
        sales: {
          currentMonthSalesAmount,
          lastMonthSalesAmount,
          salesGrowthRate,
          totalSalesAmount,
        },
      },
    });
  } catch (error: any) {
    console.log("Error: ", error.message);
    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      msg: error.message,
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
      msg: error.message,
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
      msg: error.message,
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
      res.status(200).json({
        status: ServerStatusMessage.OK,
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
      res.status(200).json({
        status: ServerStatusMessage.OK,
        msg: "The order can no longer be changed to Pending.",
      });

      return;
    };
    
    /* Avoid change order status if already has been set as "Done". */
    if (statusExists!.name !== StatusOption["Done"] && orderExists.status.name === StatusOption["Done"]) {
      res.status(200).json({
        status: ServerStatusMessage.OK,
        msg: "The order can no longer change its status because already is Done.",
      });

      return;
    };

    const orderUpdated = await orderService.updateOrder(id, updates) as Order;

    res.status(200).json({
      status: ServerStatusMessage.UPDATED,
      msg: "Order updated successfully.",
      data: orderUpdated,
    });
  } catch (error: any) {
    console.log("Error: ", error.message);
    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      msg: error.message,
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
      status: ServerStatusMessage.DELETED,
      msg: "Order deleted successfully.",
    });
  } catch (error: any) {
    console.log("Error: ", error.message);
    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      msg: error.message,
    });
  };
};

export {
  findOrders,
  findOrdersStatsByMonth,
  findOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
};
