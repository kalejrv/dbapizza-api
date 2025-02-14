import { Order, OrderItem, OrderUser, PizzaDetail, ToppingsDetail } from "@types";
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

const PizzaDetailSchema: Schema = new Schema<PizzaDetail>({
  pizza: {
    type: Types.ObjectId,
    ref: "Pizzas",
    required: true,
  },
  pizzaTotalPrice: {
    type: Number,
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
  pizzaDetail: {
    type: PizzaDetailSchema,
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
