import { Flavor } from "@types";
import mongoose, { Schema } from "mongoose";

/**
* @openapi
* components:
*   schemas:
*     Flavor:
*       type: object
*       properties:
*         name: 
*           type: string
*           example: White
*         description:
*           type: string
*           example: Mozzarella cheese, Butter and Oregano.
*         price:
*           type: number
*           example: 20
*/
const FlavorSchema: Schema = new Schema<Flavor>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
  versionKey: false,
});

export const FlavorModel = mongoose.model<Flavor>("Flavors", FlavorSchema);
