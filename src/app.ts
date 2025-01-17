import dbConnection from "@config/mongodb";
import app from "@server/server";
import dotenv from "dotenv";

dotenv.config();
dbConnection();

const PORT: number = Number(process.env.SERVER_PORT) || 4000;
app.listen(PORT, () => {
  console.log(`API running on: http://localhost:${PORT}/api/v1`);
});
