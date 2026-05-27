// import "module-alias/register";
import config from "@config/config";
import dbConnection from "@db/mongodb";
import swaggerDocs from "@docs/swagger";
import app from "@server/server";

dbConnection();
const port = config.server.port;

app.listen(port, (): void => {
  swaggerDocs(app, port);
  console.log(`API running on: ${port}`);
});
