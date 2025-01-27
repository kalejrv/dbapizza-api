import { authRouter, flavorRoutes, roleRoutes, toppingRoutes, userRoutes } from "@routes";
import express, { Application } from "express";
import morgan from "morgan";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

const v1Api: string = "/api/v1";
app.use(`${v1Api}`,
  authRouter(),
  roleRoutes(),
  userRoutes(),
  flavorRoutes(),
  toppingRoutes(),
);

export default app;
