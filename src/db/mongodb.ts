import mongoose from "mongoose";
import dotenv from "dotenv";
import config from "@config/config";

dotenv.config();
const uri = config.db.uri as string;

const dbConnection = async (): Promise<void> => {
  try {
    const db = await mongoose.connect(uri);
    console.log(`Connection to "${db.connection.name}" successfully.`);
  } catch (error: any) {
    console.log("Error: ", error.message);
    process.exit(1);
  };
};

export default dbConnection;
