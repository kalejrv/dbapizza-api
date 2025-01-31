import { authRouter, flavorRoutes, pizzaRoutes, roleRoutes, sizeRoutes, toppingRoutes, userRoutes } from "@routes";
import express, { Application } from "express";
import morgan from "morgan";

const app: Application = express();
const v1Api: string = "/api/v1";

app.use(express.json()); /* Allow parse JSON data format. */
app.use(express.urlencoded({ extended: true })); /* Allow user data from forms. */
app.use(morgan("dev")); /* Log http requests. */
app.use(`${v1Api}/images/pizzas`, express.static("uploads/pizzas")); /* Set static folders for serving images. */

app.use(`${v1Api}`, /* Set app routing. */
  authRouter(),
  roleRoutes(),
  userRoutes(),
  flavorRoutes(),
  toppingRoutes(),
  sizeRoutes(),
  pizzaRoutes(),
);

export default app;
