import { User } from "@types";
import mongoose, { Schema, Types } from "mongoose";

const UserSchema: Schema = new Schema<User>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    ref: "Roles",
    type: Types.ObjectId,
  },
}, {
  timestamps: true,
  versionKey: false,
});

export const UserModel = mongoose.model<User>("Users", UserSchema);
