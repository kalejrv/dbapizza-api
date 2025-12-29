import { Request, Response } from "express";
import { addNewStatusHistory, calculateItemsGrowthRate, calculateSalesGrowthRate, calculateTotalOrder, createOrderCode, formatOrderItems, pagination } from "@helpers";
import { OrderRepository, StatusRepository } from "@repositories";
import { OrderService, StatusService } from "@services";
import { APIResponse, DeliveryType, IOrderRepository, IOrderService, IStatusRepository, IStatusService, NewOrder, NewOrderItem, Order, OrderDelivery, OrderItem, OrderStatusHistory, OrderUpdates, OrderUser, PaginationModel, ServerStatusMessage, Status, StatusDoc, StatusOption } from "@types";
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
    /* Validate if come query params. */
    if (Object.values(query).length === 0) {
      const items = await orderService.findOrders();
      if (items.length === 0) {
        res.status(200).json({
          status: ServerStatusMessage.OK,
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
      res.status(200).json({
        status: ServerStatusMessage.OK,
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

  /* Validate that year and month values don't be falsy values. */
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
    /* Find orders by a range date and total orders. */
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
    const { currentMonthSalesAmount, lastMonthSalesAmount, salesGrowthRate } = calculateSalesGrowthRate({
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

  /* Validate order id. */
  const validId = isAValidId(id);
  if (!validId) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "Invalid Id.",
    });

    return;
  };

  try {
    /* Validate that order exists. */
    const orderExists = await orderService.findOrderById(id);
    if (!orderExists) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: "Not order found.",
      });

      return;
    };
    
    res.status(200).json({
      status: ServerStatusMessage.OK,
      data: orderExists,
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
  const newOrder: NewOrder = body;
  const { items, deliveryType, notes } = newOrder;
  
  /* Validate that order don't come with falsy values. */
  for (const key in newOrder) {
    if (key === 'notes') continue;

    const k = key as keyof NewOrder;

    if ((typeof newOrder[k] === 'string') || Array.isArray(newOrder[k])) {
      if (newOrder[k].length === 0) {
        res.status(400).json({
          status: ServerStatusMessage.BAD_REQUEST,
          msg: "Items pizza and Delivery option are required.",
        });

        return;
      };
    };
  };
  
  /* Validate that items don't come with properties as falsy values. */
  for (const item of items) {
    for (const key in item) {
      if (key === "toppings") continue;
      
      if ((String(item[key as keyof NewOrderItem]).trim().length === 0) || item["quantity"] <= 0) {
        res.status(400).json({
          status: ServerStatusMessage.BAD_REQUEST,
          msg: "Pizza, Size and Quantity values are required.",
        });
        
        return;
      };
    };
  };

  /* Validate that Delivery value be a valid Delivery option. */
  if (!Object.values(DeliveryType).includes(deliveryType as DeliveryType)) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: `Delivery option should be: ${DeliveryType.Delivery} or ${DeliveryType.PickUp}.`,
    });

    return;
  };
  
  try {
    /* Search for 'Pending' status wich is initial status for orders. */
    const statusExists = await statusService.findStatusByName("Pending") as StatusDoc;
    if (!statusExists) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: "Status not found.",
      });
      return;
    };

    /* Build order properties. */
    const code: string = createOrderCode({ firstName, lastName });
    const user: OrderUser = { firstName, lastName, address, phone, email };
    const orderItems: OrderItem[] = await formatOrderItems(items);
    const delivery: OrderDelivery = { type: deliveryType, estimatedTime: 20 };
    const status: string = statusExists._id as string;
    const statusHistory: OrderStatusHistory[] = [addNewStatusHistory(statusExists)];
    const total: number = calculateTotalOrder(orderItems);

    /* Create order. */
    const orderCreated: Order = await orderService.createOrder({
      code,
      user,
      items: orderItems,
      delivery,
      status,
      statusHistory,
      notes,
      total,
    });
    
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
  const { body, params } = req;
  const { status, deliveryType, notes }: OrderUpdates = body;
  const { id } = params;

  /* Validate order id. */
  const validOrderId = isAValidId(id);
  if (!validOrderId) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "Invalid order Id.",
    });

    return;
  };
  
  /* Validate if don't come changes. */
  if (Object.values(body).length === 0) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "At least 1 change is required.",
    });

    return;
  };

  /* Validate if deliveryType come in updates don't be different of a DeliveryType option. */
  if (("deliveryType" in body) && !Object.values(DeliveryType).includes(deliveryType as DeliveryType)) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: `Delivery option should be: ${DeliveryType.Delivery} or ${DeliveryType.PickUp}.`,
    });

    return;
  };

  /* Validate if notes come in updates dont't different of a string. */
  if (("notes" in body) && (typeof notes !== "string") || (notes?.length === 0)) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "Notes should be a valid text.",
    });

    return;
  };
  
  /* Validate if status come in updates don't be an invalid status id. */
  const validStatusId = isAValidId(status as string);
  if (("status" in body) && !validStatusId) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "Status should be a valid Status id.",
    });

    return;
  };

  try {
    /* Validate if order don't exists. */
    const orderExists = await orderService.findOrderById(id);
    if (!orderExists) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: "Order not found.",
      });
      
      return;
    };
    
    /* Validate if status don't exists. */
    const currentOrderStatus = (orderExists.status as StatusDoc);
    const newOrderStatus = await statusService.findStatusById( status as string ?? currentOrderStatus._id as string);
    if (!newOrderStatus) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: "Status not found.",
      });
      
      return;
    };
    
    /* Avoid cancel an order if its status is different of "Pending". */
    if ((currentOrderStatus.name !== StatusOption.Pending) && (newOrderStatus.name === StatusOption.Cancelled)) {
      res.status(409).json({
        status: ServerStatusMessage.CONFLICT,
        msg: `The order can not be cancelled because its current status is: ${(orderExists.status as Status).name}.`,
      });

      return;
    };

    /* Avoid update the order if its status is "Cancelled". */
    if ((currentOrderStatus.name === StatusOption.Cancelled) && (Object.values(body).length > 0)) {
      res.status(409).json({
        status: ServerStatusMessage.CONFLICT,
        msg: "The order can not be updated because already has been cancelled.",
      });

      return;
    };

    /* Avoid updates from customer if order status is "On the way". */
    if ((deliveryType || notes) && (currentOrderStatus.name === StatusOption.OnTheWay)) {
      res.status(409).json({
        status: ServerStatusMessage.CONFLICT,
        msg: `The order not longer accept updates because is ${StatusOption.OnTheWay}.`,
      });

      return;
    };

    /* Avoid that status can be setted different of "Delivered" if current order status is "On the way". */
    if (status && (newOrderStatus.name !== StatusOption.Delivered) && (currentOrderStatus.name === StatusOption.OnTheWay)) {
      res.status(409).json({
        status: ServerStatusMessage.CONFLICT,
        msg: `Status only can be set to '${StatusOption.Delivered}' because the current order status is '${StatusOption.OnTheWay}'.`,
      });

      return;
    };

    /* Add new status to statusHistory validating that new status doesn't exists in statusHistory. */
    const statusHistory = orderExists.statusHistory;
    const statusHistoryNames: string[] = [];
    for (const history of statusHistory) {
      statusHistoryNames.push(history.name);
    };
    if (!statusHistoryNames.includes(newOrderStatus.name)) {
      statusHistory.push(addNewStatusHistory(newOrderStatus));
    };

    /* Build order updates. */
    const updates: Partial<Order> = {
      status,
      statusHistory,
      delivery: {
        type: deliveryType || orderExists.delivery.type,
        estimatedTime: orderExists.delivery.estimatedTime,
      },
      notes,
    };
    const orderUpdated = await orderService.updateOrder(id, updates);
    
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
