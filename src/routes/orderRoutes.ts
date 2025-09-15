import { Router } from "express";
import { createOrder, deleteOrder, findOrderById, findOrders, updateOrder } from "@controllers";
import { checkUserPermissions, verifyUserAuth } from "@middlewares";

const router = Router();
const basePath: string = "/orders";

export const orderRoutes = (): Router => {
  /**
* @openapi
* /api/v1/orders:
*   get:
*     summary: Find all orders.
*     description: This endpoint allow to show all orders records.
*     tags:
*       - Orders
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
*                     orders:
*                       type: array
*                       items: 
*                         $ref: "#/components/schemas/Order"
*                     totalOrders:
*                       type: number
*                       example: 50
*                     ordersByPage:
*                       type: number
*                       example: 10
*                     currentOrdersQuantity:
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
  router.get(`${basePath}`, verifyUserAuth, checkUserPermissions, findOrders);
  
  /**
* @openapi
* /api/v1/orders/{id}:
*   get:
*     summary: Find an order.
*     description: This endpoint allow to show an order record by its id.
*     tags:
*       - Orders
*     security:
*       - BearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         description: An order id.
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
*                   $ref: "#/components/schemas/Order"
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
  router.get(`${basePath}/:id`, verifyUserAuth, checkUserPermissions, findOrderById);
  
  /**
* @openapi
* /api/v1/orders:
*   post:
*     summary: Create an order.
*     description: This endpoint allow to create a new order record.
*     tags:
*       - Orders
*     security:
*       - BearerAuth: []
*     requestBody:
*       description: Request body with a new order record.
*       required: true
*       content:
*         application/json:
*           schema:
*             type: array
*             items:
*               type: object
*               properties:
*                 pizza:
*                   type: string
*                   description: A pizza id.
*                   required: true
*                   example: 679c564a98f35f60cbd62cb4
*                 toppings:
*                   type: array
*                   required: false
*                   items:
*                     type: string
*                     description: A topping id.
*                     example: 6798083696d97dd292904d5a
*                 quantity:
*                   type: string
*                   required: true
*                   example: 2
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
*                   example: Order created successfully.
*                 data:
*                   type: object
*                   $ref: "#/components/schemas/Order"
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
  router.post(`${basePath}`, verifyUserAuth, checkUserPermissions, createOrder);
  
  /**
* @openapi
* /api/v1/orders/{id}:
*   patch:
*     summary: Update an order.
*     description: This endpoint allow to update an order record created by its id.
*     tags:
*       - Orders
*     security:
*       - BearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         description: An order id.
*         required: true
*     requestBody:
*       description: Request body with order record updates.
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               status:
*                 type: string
*                 description: An id Status.
*                 example: 67a3c2d5bf121dc0b5f883dd
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
*                   $ref: Some ok message.
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
*                   example: Order updated successfully.
*                 data:
*                   type: object
*                   $ref: "#/components/schemas/Order"
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
  router.patch(`${basePath}/:id`, verifyUserAuth, checkUserPermissions, updateOrder);

  /**
* @openapi
* /api/v1/orders/{id}:
*   delete:
*     summary: Delete an order.
*     description: This endpoint allow to delete an order record created by its id.
*     tags:
*       - Orders
*     security:
*       - BearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         description: An order id.
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
*                   example: Order deleted successfully.
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
  router.delete(`${basePath}/:id`, verifyUserAuth, checkUserPermissions, deleteOrder);

  return router;
};
