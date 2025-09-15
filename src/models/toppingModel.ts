import mongoose, { Schema } from "mongoose";
import { Topping } from "@types";

/**
* @openapi
* components:
*   schemas:
*     Topping:
*       type: object
*       properties:
*         name: 
*           type: string
*           example: Mushrooms
*         price:
*           type: number
*           example: 20
*/
const ToppingSchema: Schema = new Schema<Topping>({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  }
}, {
  timestamps: true,
  versionKey: false,
});

export const ToppingModel = mongoose.model<Topping>("Toppings", ToppingSchema);
