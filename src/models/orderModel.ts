import { Order, OrderItem, OrderUser, ToppingsDetail } from "@types";
import mongoose, { Schema, Types } from "mongoose";

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

const ToppingsDetailSchema: Schema = new Schema<ToppingsDetail>({
  toppings: [{
    type: Types.ObjectId,
    ref: "Toppings",
  }],
  toppingsTotalPrice: {
    type: Number,
    required: true,
  },
});

const OrderItemSchema: Schema = new Schema<OrderItem>({
  pizza: {
    type: Types.ObjectId,
    ref: "Pizzas",
    required: true,
  },
  toppingsDetail: {
    type: ToppingsDetailSchema,
    required: false,
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
*                 type: string
*                 example: 679c57cd105154cb855d7fd3
*                 Description: "A pizza id."
*               toppingsDetail:
*                 type: object
*                 properties:
*                   toppings:
*                     type: array
*                     items:
*                       type: string
*                       example: 6798077e96d97dd292904d2d
*                       Description: "A topping id."
*                   toppingsTotalPrice:
*                     type: number
*                     example: 220
*               quantity:
*                 type: number
*                 example: 1
*               total:
*                 type: number
*                 example: 850
*         status:
*           $ref: "#/components/schemas/Status"
*         total:
*           type: number
*           example: 1250
*/
const OrderSchema: Schema = new Schema<Order>({
  user: {
    type: OrderUserSchema,
    required: true,
  },
  items: {
    type: [OrderItemSchema],
    required: true,
  },
  status: {
    type: Types.ObjectId,
    ref: "Status",
    required: true,
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
