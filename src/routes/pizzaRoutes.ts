import { createPizza, deletePizza, findPizzaById, findPizzas, updatePizza } from "@controllers";
import { checkUserPermissions, uploadPizzaImage, verifyUserAuth } from "@middlewares";
import { Router } from "express";

const router = Router();
const basePath: string = "/pizzas";

export const pizzaRoutes = () => {
  router.get(`${basePath}`, verifyUserAuth, checkUserPermissions, findPizzas);
  router.get(`${basePath}/:id`, verifyUserAuth, checkUserPermissions, findPizzaById);
  router.post(`${basePath}`, verifyUserAuth, checkUserPermissions, uploadPizzaImage.single("pizza_image"), createPizza);
  router.patch(`${basePath}/:id`, verifyUserAuth, checkUserPermissions, uploadPizzaImage.single("pizza_image"), updatePizza);
  router.delete(`${basePath}/:id`, verifyUserAuth, checkUserPermissions, deletePizza);

  return router;
};
