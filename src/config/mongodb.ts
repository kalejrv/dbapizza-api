import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const URI = process.env.DB_URI as string;

const dbConnection = async () => {
  try {
    const db = await mongoose.connect(URI);
    console.log(`Connection to "${db.connection.name}" successfully.`);
  } catch (error: any) {
    console.log("Error: ", error.message);
    process.exit(1);
  };
};

export default dbConnection;