import { authRouter, flavorRoutes, orderRoutes, pizzaRoutes, roleRoutes, sizeRoutes, statusRoutes, toppingRoutes, userRoutes } from "@routes";
import express, { Application } from "express";
import morgan from "morgan";
import cors from "cors";

const app: Application = express();
const v1Api: string = "/api/v1";

app.use(express.json()); /* Allow parse JSON data format. */
app.use(express.urlencoded({ extended: true })); /* Allow user data from forms. */
app.use(morgan("dev")); /* Log http requests. */
app.use(`${v1Api}/images/pizzas`, express.static("uploads/pizzas")); /* Set static folders for serving images. */
app.use(cors({ /* Add CORS and its initial config. */
  methods: "GET, POST, PATCH, PUT, DELETE",
  allowedHeaders: "Content-Type, Authorization",
}));

app.use(`${v1Api}`, /* Set app routing. */
  authRouter(),
  roleRoutes(),
  userRoutes(),
  flavorRoutes(),
  toppingRoutes(),
  sizeRoutes(),
  pizzaRoutes(),
  statusRoutes(),
  orderRoutes(),
);

export default app;
