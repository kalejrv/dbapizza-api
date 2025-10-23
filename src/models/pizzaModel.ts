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
*         size:
*           type: string
*           example: 679488d052da6f6ec1998cc3
*         image:
*           type: string
*           example: image.jpg
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
