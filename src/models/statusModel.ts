import { Status, StatusOption } from "@types";
import mongoose, { Schema } from "mongoose";

/**
* @openapi
* components:
*   schemas:
*     Status:
*       type: object
*       properties:
*         name: 
*           type: string
*           example: Pending
*         description:
*           type: string
*           example: The order has not yet begun to be carried out.
*/
const StatusSchema: Schema = new Schema<Status>({
  name: {
    type: String,
    enum: Object.values(StatusOption),
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
}, {
  timestamps: true,
  versionKey: false,
});

export const StatusModel = mongoose.model<Status>("Status", StatusSchema);
