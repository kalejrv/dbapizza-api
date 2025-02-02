import { Pizza } from "@types";
import mongoose, { Schema, Types } from "mongoose";

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
*         size:
*           type: string
*           example: 679488d052da6f6ec1998cc3
*         image:
*           type: number
*           example: image.jpg
*/
const PizzaSchema: Schema = new Schema<Pizza>({
  flavor: {
    ref: "Flavors",
    type: Types.ObjectId,
    required: true,
  },
  size: {
    ref: "Sizes",
    type: Types.ObjectId,
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
