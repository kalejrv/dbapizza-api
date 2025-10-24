import mongoose, { Schema } from "mongoose";
import { DeliveryType, Order, OrderDelivery, OrderItem, OrderStatusHistory, OrderUser, StatusOption } from "@types";

const OrderUserSchema: Schema = new Schema<OrderUser>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

const OrderItemSchema: Schema = new Schema<OrderItem>({
  pizza: {
    type: Schema.Types.ObjectId,
    ref: "Pizzas",
    required: true,
  },
  size: {
    type: Schema.Types.ObjectId,
    ref: "Sizes",
    required: true,
  },
  extra: {
    toppings: [{
      type: Schema.Types.ObjectId,
      ref: "Toppings",
      required: false,
    }],
    total: {
      type: Number,
      required: false,
    },
  },
  quantity: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
});

const OrderDeliverySchema: Schema = new Schema<OrderDelivery>({
  type: {
    type: String,
    enum: Object.values(DeliveryType),
    required: true,
  },
  estimatedTime: {
    type: Number,
    required: true,
  },
});

const OrderStatusHistorySchema: Schema = new Schema<OrderStatusHistory>({
  name: {
    type: String,
    enum: Object.values(StatusOption),
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
});

/**
* @openapi
* components:
*   schemas:
*     Order:
*       type: object
*       properties:
*         user:
*           type: object
*           properties:
*             firstName:
*               type: string
*               example: Kevin
*             lastName:
*               type: string
*               example: Reyes
*             address:
*               type: string
*               example: 23th street "Las praderas", Managua, Nicaragua
*             phone:
*               type: string
*               example: 5555 5555
*             email:
*               type: string
*               example: kevin@correo.com
*         items:
*           type: array
*           items:
*             type: object
*             properties:
*               pizza:
*                 type: Pizza | string
*                 example: 679c57cd105154cb855d7fd3
*                 description: "A Pizza document or id."
*               size:
*                 type: Size | string
*                 example: 679c57cd105154cb855d7fd3
*                 description: "A Size document or id."
*               extra:
*                 type: object
*                 properties:
*                   toppings:
*                     type: array
*                     items:
*                       type: string
*                       example: 6798077e96d97dd292904d2d
*                       description: "A topping id."
*                   total:
*                     type: number
*                     example: 220
*               quantity:
*                 type: number
*                 example: 1
*               total:
*                 type: number
*                 example: 850
*         delivery:
*           type: object
*           properties:
*             type:
*               type: string
*               example: "Delivery"
*               description: "A delivery option."
*             estimatedTime:
*               type: number
*               example: 20
*               description: "Time in minutes to complete an order."             
*         status:
*           type: Status | string
*           example: "6798077e96d97dd292904d2d" 
*           description: "A Status document or id."
*         statusHistory:
*           type: array
*           items:
*             type: object
*             properties:
*               name:
*                 type: string
*                 example: "Pending"
*                 description: "A Status name."
*               timestamp:
*                 type: Date
*                 exmaple: 2025-10-20T18:16:12.000+00:00
*                 description: "Date which the order was updated."
*         notes:
*           type: string
*           example: "Call me when the order is done, please."
*           description: "Customer notes."
*         total:
*           type: number
*           example: 1250
*/
const OrderSchema: Schema = new Schema<Order>({
  code: {
    type: String,
    required: true,
  },
  user: {
    type: OrderUserSchema,
    required: true,
  },
  items: {
    type: [OrderItemSchema],
    required: true,
  },
  delivery: {
    type: OrderDeliverySchema,
    required: true,
  },
  status: {
    type: Schema.Types.ObjectId,
    ref: "Status",
    required: true,
  },
  statusHistory: {
    type: [OrderStatusHistorySchema],
    required: true,
  },
  notes: {
    type: String,
    required: false,
  },
  total: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
  versionKey: false,
});

export const OrderModel = mongoose.model<Order>("Orders", OrderSchema);
