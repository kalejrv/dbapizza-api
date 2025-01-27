import { Topping } from "@types";
import mongoose, { Schema } from "mongoose";

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
