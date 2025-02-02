import { createPizza, deletePizza, findPizzaById, findPizzas, updatePizza } from "@controllers";
import { checkUserPermissions, uploadPizzaImage, verifyUserAuth } from "@middlewares";
import { Router } from "express";

const router = Router();
const basePath: string = "/pizzas";

export const pizzaRoutes = () => {
  /**
* @openapi
* /api/v1/pizzas:
*   get:
*     summary: Find all pizzas.
*     description: This endpoint allow to show all pizzas records.
*     tags:
*       - Pizzas
*     security:
*       - BearerAuth: []
*     parameters:
*       - name: page
*         in: query
*         schema:
*           type: number
*         description: A number page.
*         required: false
*       - name: limit
*         in: query
*         schema:
*           type: number
*         description: Quantity of records to achieve.
*         required: false
*     responses:
*       200:
*         description: OK
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 status:
*                   type: string
*                   example: OK
*                 data:
*                   type: object
*                   properties:
*                     pizzas:
*                      type: array
*                      items: 
*                        $ref: "#/components/schemas/Pizza"
*                     totalPizzas:
*                       type: number
*                       example: 50
*                     pizzasByPage:
*                       type: number
*                       example: 10
*                     currentPizzasQuantity:
*                       type: number
*                       example: 10
*                     currentPage:
*                       type: number
*                       example: 1
*                     totalPage:
*                       type: number
*                       example: 5
*       400:
*         description: BAD REQUEST
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 status:
*                   type: string
*                   example: BAD_REQUEST
*                 msg:
*                   type: string
*                   example: Some error message.
*       404:
*         description: NOT FOUND
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 status:
*                   type: string
*                   example: NOT_FOUND
*                 msg:
*                   type: string
*                   example: Some error message.
*       500:
*         description: FAILED
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 status: 
*                   type: string
*                   example: FAILED
*                 error:
*                   type: object
*/
  router.get(`${basePath}`, verifyUserAuth, checkUserPermissions, findPizzas);

  /**
* @openapi
* /api/v1/pizzas/{id}:
*   get:
*     summary: Find a pizza.
*     description: This endpoint allow to show a pizza record by its id.
*     tags:
*       - Pizzas
*     security:
*       - BearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         description: A pizza id.
*         required: true
*     responses:
*       200:
*         description: OK
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 status:
*                   type: string
*                   example: OK
*                 data:
*                   type: object
*                   $ref: "#/components/schemas/Pizza"
*       400:
*         description: BAD REQUEST
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 status:
*                   type: string
*                   example: BAD_REQUEST
*                 msg:
*                   type: string
*                   example: Some error message.
*       404:
*         description: NOT FOUND
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 status:
*                   type: string
*                   example: NOT_FOUND
*                 msg:
*                   type: string
*                   example: Some error message.
*       500:
*         description: FAILED
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 status: 
*                   type: string
*                   example: FAILED
*                 error:
*                   type: object
*/
  router.get(`${basePath}/:id`, verifyUserAuth, checkUserPermissions, findPizzaById);

  /**
* @openapi
* /api/v1/pizzas:
*   post:
*     summary: Create a pizza.
*     description: This endpoint allow to create a new pizza record.
*     tags:
*       - Pizzas
*     security:
*       - BearerAuth: []
*     requestBody:
*       description: Request body with a new pizza record.
*       required: true
*       content:
*         multipart/form-data:
*           schema:
*             type: object
*             properties:
*               flavor:
*                 type: string
*                 description: A flavor id.
*               size:
*                 type: string
*                 description: A size id.
*               pizza_image:
*                 type: file
*                 description: A pizza image.
*     responses:
*       201:
*         description: CREATED
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 status:
*                   type: string
*                   example: CREATED
*                 msg:
*                   type: string
*                   example: Pizza created successfully.
*                 data:
*                   type: object
*                   $ref: "#/components/schemas/Pizza"
*       400:
*         description: BAD REQUEST
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 status:
*                   type: string
*                   example: BAD_REQUEST
*                 msg:
*                   type: string
*                   example: Some error message.
*       500:
*         description: FAILED
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 status: 
*                   type: string
*                   example: FAILED
*                 error:
*                   type: object
*/
  router.post(`${basePath}`, verifyUserAuth, checkUserPermissions, uploadPizzaImage.single("pizza_image"), createPizza);
  
  /**
* @openapi
* /api/v1/pizzas/{id}:
*   patch:
*     summary: Update a pizza.
*     description: This endpoint allow to update a pizza record created by its id.
*     tags:
*       - Pizzas
*     security:
*       - BearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         description: A pizza id.
*         required: true
*     requestBody:
*       description: Request body with pizza record updates.
*       required: true
*       content:
*         multipart/form-data:
*           schema:
*             type: object
*             properties:
*               pizza_image:
*                 type: file
*                 description: A pizza image.
*     responses:
*       201:
*         description: CREATED
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 status:
*                   type: string
*                   example: CREATED
*                 msg:
*                   type: string
*                   example: Pizza updated successfully.
*                 data:
*                   type: object
*                   $ref: "#/components/schemas/Pizza"
*       400:
*         description: BAD REQUEST
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 status:
*                   type: string
*                   example: BAD_REQUEST
*                 msg:
*                   type: string
*                   example: Some error message.
*       404:
*         description: NOT FOUND
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 status:
*                   type: string
*                   example: NOT_FOUND
*                 msg:
*                   type: string
*                   example: Some error message.
*       500:
*         description: FAILED
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 status: 
*                   type: string
*                   example: FAILED
*                 error:
*                   type: object
*/
  router.patch(`${basePath}/:id`, verifyUserAuth, checkUserPermissions, uploadPizzaImage.single("pizza_image"), updatePizza);
  
  /**
* @openapi
* /api/v1/pizzas/{id}:
*   delete:
*     summary: Delete a pizza.
*     description: This endpoint allow to delete a pizza record created by its id.
*     tags:
*       - Pizzas
*     security:
*       - BearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         description: A pizza id.
*         required: true
*     responses:
*       200:
*         description: OK
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 status:
*                   type: string
*                   example: OK
*                 msg:
*                   type: string
*                   example: Pizza deleted successfully.
*       400:
*         description: BAD REQUEST
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 status:
*                   type: string
*                   example: BAD_REQUEST
*                 msg:
*                   type: string
*                   example: Some error message.
*       404:
*         description: NOT FOUND
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 status:
*                   type: string
*                   example: NOT_FOUND
*                 msg:
*                   type: string
*                   example: Some error message.
*       500:
*         description: FAILED
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 status: 
*                   type: string
*                   example: FAILED
*                 error:
*                   type: object
*/
  router.delete(`${basePath}/:id`, verifyUserAuth, checkUserPermissions, deletePizza);

  return router;
};
