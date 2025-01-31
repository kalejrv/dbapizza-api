import { Pizza } from "@types";
import mongoose, { Schema, Types } from "mongoose";

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
