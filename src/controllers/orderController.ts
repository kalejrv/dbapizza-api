import { calculateTotalOrder, formatOrderItems } from "@helpers";
import { OrderRepository, StatusRepository } from "@repositories";
import { OrderService, StatusService } from "@services";
import { IOrderRepository, IOrderService, IStatusRepository, IStatusService, Order, OrderItem, OrderItemFromBodyRequest, ServerStatusMessage, Status, StatusOption } from "@types";
import { isAValidId } from "@utils";
import { Request, Response } from "express";

const orderRepository: IOrderRepository = new OrderRepository;
const orderService: IOrderService = new OrderService(orderRepository);

const statusRepository: IStatusRepository = new StatusRepository;
const statusService: IStatusService = new StatusService(statusRepository);

const findOrders = async (_req: Request, res: Response): Promise<void> => { 
  try {
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
      data: orders,
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
