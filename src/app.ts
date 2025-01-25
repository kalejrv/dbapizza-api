// import "module-alias/register";
import dbConnection from "@config/mongodb";
import swaggerDocs from "@docs/swagger";
import app from "@server/server";
import dotenv from "dotenv";

dotenv.config();
dbConnection();

const SERVER_PORT: number = Number(process.env.SERVER_PORT) || 4000;
app.listen(SERVER_PORT, () => {
  swaggerDocs(app, SERVER_PORT);
  console.log(`API running on: ${SERVER_PORT}`);
});
