import { User } from "@types";
import mongoose, { Schema, Types } from "mongoose";
import bcrypt from "bcrypt";

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
    required: true,
  },
}, {
  timestamps: true,
  versionKey: false,
});

UserSchema.pre<User>("save", async function(next): Promise<void> {
  const user = this;

  if (user.isNew || user.isModified("password")) {
    try {
      const SALT_ROUNDS: number = 10;
      const SALT = await bcrypt.genSalt(SALT_ROUNDS);
  
      user.password = await bcrypt.hash(user.password, SALT);
    } catch (error: any) {
      next(error);
    };
  };
});

UserSchema.methods.hashPassword = async function(password: string): Promise<string> {
  let hashedPassword: string = "";

  try {
    const SALT_ROUNDS: number = 10;
    const SALT = await bcrypt.genSalt(SALT_ROUNDS);

    hashedPassword = await bcrypt.hash(password, SALT);
  } catch (error: any) {
    console.log(error.message);
  };

  return hashedPassword;
};

UserSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
  const user = this;
  return await bcrypt.compare(password, user.password);
};

export const UserModel = mongoose.model<User>("Users", UserSchema);
