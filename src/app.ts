// import "module-alias/register";
import dbConnection from "@config/mongodb";
import app from "@server/server";
import dotenv from "dotenv";

dotenv.config();
dbConnection();

const SERVER_PORT: number = Number(process.env.SERVER_PORT) || 4000;
app.listen(SERVER_PORT, () => {
  console.log(`API running on: ${SERVER_PORT}`);
});
