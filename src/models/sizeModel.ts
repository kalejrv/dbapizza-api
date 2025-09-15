import mongoose, { Schema } from "mongoose";
import { Size } from "@types";

/**
* @openapi
* components:
*   schemas:
*     Size:
*       type: object
*       properties:
*         name: 
*           type: string
*           example: Personal
*         price:
*           type: number
*           example: 135
*/
const SizeSchema: Schema = new Schema<Size>({
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

export const SizeModel = mongoose.model<Size>("Sizes", SizeSchema);
