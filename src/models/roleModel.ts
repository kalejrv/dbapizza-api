import { Role } from "@types";
import mongoose, { Schema } from "mongoose";

const RoleSchema: Schema = new Schema<Role>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    permissions: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const RoleModel = mongoose.model<Role>("Roles", RoleSchema);
