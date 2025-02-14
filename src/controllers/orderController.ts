import { calculateTotalOrder, formatOrderItems, ordersPagination } from "@helpers";
import { OrderRepository, StatusRepository } from "@repositories";
import { OrderService, StatusService } from "@services";
import { IOrderRepository, IOrderService, IStatusRepository, IStatusService, Order, OrderItem, OrderItemFromBodyRequest, ServerStatusMessage, Status, StatusOption } from "@types";
import { isAValidId, isAValidNumber } from "@utils";
import { Request, Response } from "express";

const orderRepository: IOrderRepository = new OrderRepository;
const orderService: IOrderService = new OrderService(orderRepository);

const statusRepository: IStatusRepository = new StatusRepository;
const statusService: IStatusService = new StatusService(statusRepository);

const findOrders = async (req: Request, res: Response): Promise<void> => { 
  const { query } = req;
  
  try {
    /* If query object from request is empty do this. */
    if (Object.values(query).length === 0) {
      const orders = await orderService.findOrders();
      if (orders.length === 0) {
        res.status(404).json({
          status: ServerStatusMessage.NOT_FOUND,
          msg: "No order found.",
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

    /* Validate that query object values are of type "number". */
    const pageIsAValidNumber: boolean = isAValidNumber(query.page as string);
    const limitIsAValidNumber: boolean = isAValidNumber(query.limit as string);
    
    if (!pageIsAValidNumber || !limitIsAValidNumber) {
      res.status(400).json({
        status: ServerStatusMessage.BAD_REQUEST,
        msg: "Page and limit values can not to be diferent of a valid number.",
      });

      return;
    };

    /* Set page, limit and skip values. */
    const page: number = Number(query.page);
    const limit: number = Number(query.limit);
    const skip: number = (page - 1) * limit;

    /* Validate that page and limit values are not equal to zero. */
    if ((page === 0) || (limit === 0)) {
      res.status(400).json({
        status: ServerStatusMessage.BAD_REQUEST,
        msg: "Page and Limit values can not to be equal to zero.",
      });

      return;
    };

    /* Get paginated orders. */
    const paginatedOrders = await ordersPagination({ page, limit, skip });
    const { orders, totalOrders, ordersByPage, currentOrdersQuantity, currentPage, totalPages } = paginatedOrders;

    /* Validate if there isn't orders. */
    if (orders.length === 0) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: "No order found.",
      });

      return;
    };

    /* Response orders paginated data. */
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

const findOrderById = async (req: Request, res: Response): Promise<void> => {
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

const createOrder = async (req: Request, res: Response): Promise<void> => {
  const { userAuth, body } = req;
  const { firstName, lastName, address, phone, email } = userAuth;
  const newOrder: OrderItemFromBodyRequest[] = body;

  if (Object.values(body).length === 0) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "Order can not to be a empty value.",
    });

    return;
  };
  
  try {
    const user = { firstName, lastName, address, phone, email };
    const items: OrderItem[] = await formatOrderItems(newOrder);
    const status = await statusService.findStatusByName("Pending") as Status;
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

const updateOrder = async (req: Request, res: Response): Promise<void> => {
  const updates = req.body;
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
    /* Check if order exists to be allowed to apply valid updates. */
    const orderExists = await orderService.findOrderById(id) as Order;
    if (!orderExists) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: "Not order found.",
      });

      return;
    };

    /* Cancel an order only if the order status is equal to "Pending". */
    const status = await statusRepository.findById(updates.status) as Status;
    if (status.name === StatusOption["Cancelled"] && (orderExists.status.name === StatusOption["InProgress"] || orderExists.status.name === StatusOption["Done"])) {
      res.status(400).json({
        status: ServerStatusMessage.BAD_REQUEST,
        msg: "The order can not to be cancelled.",
      });

      return;
    };
    
    if (status.name !== StatusOption["Cancelled"] && orderExists.status.name === StatusOption["Cancelled"]) {
      res.status(200).json({
        status: ServerStatusMessage.OK,
        msg: "The order already has been cancelled.",
      });

      return;
    };

    /* Avoid set status to "Pending" to an order that has status "In progress", "Done" or "Cancelled". */
    if (status.name === StatusOption["Pending"] && orderExists.status.name !== StatusOption["Pending"]) {
      res.status(400).json({
        status: ServerStatusMessage.BAD_REQUEST,
        msg: "The order can no longer be changed to Pending.",
      });

      return;
    };
    
    /* Avoid set status to "In progress" to an order that has status "Done". */
    if (status.name !== StatusOption["Done"] && orderExists.status.name === StatusOption["Done"]) {
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

const deleteOrder = async (req: Request, res: Response): Promise<void> => {
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
