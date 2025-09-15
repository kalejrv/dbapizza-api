import mongoose, { Schema } from "mongoose";
import { Role } from "@types";

/**
* @openapi
* components:
*   schemas:
*     Role:
*       type: object
*       properties:
*         name: 
*           type: string
*           example: admin
*         permissions:
*           type: array
*           items:
*             type: string
*             example: admin_granted
*/
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
