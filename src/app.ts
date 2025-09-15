// import "module-alias/register";
import config from "@config/config";
import dbConnection from "@db/mongodb";
import swaggerDocs from "@docs/swagger";
import app from "@server/server";

dbConnection();
const SERVER_PORT = config.server.port;

app.listen(SERVER_PORT, (): void => {
  swaggerDocs(app, SERVER_PORT);
  console.log(`API running on: ${SERVER_PORT}`);
});
