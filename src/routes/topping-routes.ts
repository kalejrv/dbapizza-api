import { Router } from "express";
import { createTopping, deleteTopping, findToppingById, findToppings, updateTopping } from "@controllers";
import { checkUserPermissions, verifyUserAuth } from "@middlewares";

const router = Router();
const basePath: string = "/toppings";

export const toppingRoutes = (): Router => {
  /**
* @openapi
* /api/v1/toppings:
*   get:
*     summary: Find all toppings.
*     description: This endpoint allow to show all toppings records.
*     tags:
*       - Toppings
*     security:
*       - BearerAuth: []
*     parameters:
*       - in: query
*         name: page
*         description: Current page number.
*         schema:
*           type: number
*       - in: query
*         name: limit
*         description: Topping records quantity.
*         schema:
*           type: number
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
*                   type: array
*                   items: 
*                     $ref: "#/components/schemas/Topping"
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
  router.get(`${basePath}`, verifyUserAuth, checkUserPermissions, findToppings);

  /**
* @openapi
* /api/v1/toppings/{id}:
*   get:
*     summary: Find a topping.
*     description: This endpoint allow to show a topping record by its id.
*     tags:
*       - Toppings
*     security:
*       - BearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         description: A topping id.
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
*                   $ref: "#/components/schemas/Flavor"
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
  router.get(`${basePath}/:id`, verifyUserAuth, checkUserPermissions, findToppingById);

  /**
* @openapi
* /api/v1/toppings:
*   post:
*     summary: Create a topping.
*     description: This endpoint allow to create a new topping record.
*     tags:
*       - Toppings
*     security:
*       - BearerAuth: []
*     requestBody:
*       description: Request body with a new Topping record.
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: "#/components/schemas/Topping"
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
*                   example: Topping created successfully.
*                 data:
*                   type: object
*                   $ref: "#/components/schemas/Topping"
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
  router.post(`${basePath}`, verifyUserAuth, checkUserPermissions, createTopping);

  /**
* @openapi
* /api/v1/toppings/{id}:
*   patch:
*     summary: Update a topping.
*     description: This endpoint allow to update a topping record created by its id.
*     tags:
*       - Toppings
*     security:
*       - BearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         description: A topping id.
*         required: true
*     requestBody:
*       description: Request body with topping record updates.
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: "#/components/schemas/Topping"
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
*                   example: Topping updated successfully.
*                 data:
*                   type: object
*                   $ref: "#/components/schemas/Topping"
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
  router.patch(`${basePath}/:id`, verifyUserAuth, checkUserPermissions, updateTopping);

  /**
* @openapi
* /api/v1/toppings/{id}:
*   delete:
*     summary: Delete a topping.
*     description: This endpoint allow to delete a topping record created by its id.
*     tags:
*       - Toppings
*     security:
*       - BearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         description: A topping id.
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
*                   example: Topping deleted successfully.
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
  router.delete(`${basePath}/:id`, verifyUserAuth, checkUserPermissions, deleteTopping);

  return router;
};
