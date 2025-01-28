import { Size, SizeOption } from "@types";
import mongoose, { Schema } from "mongoose";

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
    enum: Object.values(SizeOption),
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
