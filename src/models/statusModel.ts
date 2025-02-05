import { Status, StatusOption } from "@types";
import mongoose, { Schema } from "mongoose";

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
