import mongoose, { Schema } from "mongoose";
import { Pizza } from "@types";

/**
* @openapi
* components:
*   schemas:
*     Pizza:
*       type: object
*       properties:
*         flavor: 
*           type: string
*           example: 679488d052da6f6ec1998cc3
*           description: A flavor id.
*         size:
*           type: string
*           example: 6798425fe2bc79512193360a
*           description: A size id.
*         image:
*           type: string
*           example: image.jpg
*           description: Pizza image as reference of flavor.
*         price:
*           type: number
*           example: 200
*           description: Flavor price + Size price.
*/
const PizzaSchema: Schema = new Schema<Pizza>({
  flavor: {
    type: Schema.Types.ObjectId,
    ref: "Flavors",
    required: true,
  },
  size: {
    type: Schema.Types.ObjectId,
    ref: "Sizes",
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
  versionKey: false,
});

export const PizzaModel = mongoose.model<Pizza>("Pizzas", PizzaSchema);
