import { Router } from "express";
import { createOrder, deleteOrder, findOrderById, findOrders, findOrdersStatsByMonth, updateOrder } from "@controllers";
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
*                     items:
*                       type: array
*                       items: 
*                         $ref: "#/components/schemas/Order"
*                     totalItems:
*                       type: number
*                       example: 50
*                     itemsByPage:
*                       type: number
*                       example: 10
*                     currentItemsQuantity:
*                       type: number
*                       example: 10
*                     currentPage:
*                       type: number
*                       example: 1
*                     totalPages:
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
*                 msg:
*                   type: object
*                   exmaple: Some error message.
*/
  router.get(`${basePath}`, verifyUserAuth, checkUserPermissions, findOrders);

  /**
* @openapi
* /api/v1/orders/stats_by_month:
*   get:
*     summary: Find orders stats by month.
*     description: This endpoint allow to show all orders records stats by an specific month.
*     tags:
*       - Orders
*     security:
*       - BearerAuth: []
*     parameters:
*       - name: year
*         in: query
*         schema:
*           type: number
*         description: A year number.
*         required: true
*       - name: month
*         in: query
*         schema:
*           type: number
*         description: A number month.
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
*                   properties:
*                     year:
*                       type: number
*                       example: 2025
*                     month:
*                       type: number
*                       example: 10
*                     items:
*                       type: object
*                       properties:
*                         currentMonthItemsCount:
*                           type: number
*                           example: 15
*                         lastMonthItemsCount:
*                           type: number
*                           example: 10
*                         itemsGrowthRate:
*                           type: number
*                           example: 15.3
*                         totalItemsCount:
*                           type: number
*                           example: 25
*                     sales:
*                       type: object
*                       properties:
*                          currentMonthSalesAmount:
*                            type: number
*                            example: 2100
*                          lastMonthSalesAmount:
*                            type: 1800
*                            example:
*                          salesGrowthRate:
*                            type: 8.2
*                            example:
*                          totalSalesAmount:
*                            type: number
*                            example: 3900
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
*                 msg:
*                   type: object
*                   exmaple: Some error message.
*/
  router.get(`${basePath}/stats_by_month`, verifyUserAuth, checkUserPermissions, findOrdersStatsByMonth);
  
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
*                 msg:
*                   type: string
*                   example: Some error message.
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
*             type: object
*             properties:
*               items:
*                 type: array
*                 items:
*                   type: object
*                   properties:
*                     pizza:
*                       type: string
*                       example: 67e36132d4956342ce2cf750
*                     selectedSize:
*                       type: string
*                       example: 6798434de2bc795121933635
*                     toppings:
*                       type: array
*                       items:
*                         type: string
*                         example: 679807b796d97dd292904d3c
*                     quantity:
*                       type: number
*                       example: 2
*               deliveryType:
*                 type: string
*                 example: "PickUp"
*               notes:
*                 type: string
*                 example: Call me when the order is done, please.
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
*                 msg:
*                   type: string
*                   example: Some error message.
*/
  router.post(`${basePath}`, verifyUserAuth, checkUserPermissions, createOrder);
  
  /**
* @openapi
* /api/v1/orders/{id}:
*   patch:
*     summary: Update an order.
*     description: This endpoint allow to update an order record by its id.
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
*       description: Request body with order updates.
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               status:
*                 type: string
*                 example: 68f98a1e78596c4edf8759f0
*               deliveryType:
*                 type: string
*                 example: Delivery
*               notes:
*                 type: string
*                 example: Call me when the order is done, please.
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
*       409:
*         description: CONFLICT
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 status:
*                   type: string
*                   example: CONFLICT
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
*                 msg:
*                   type: string
*                   example: Some error message.
*/
  router.patch(`${basePath}/:id`, verifyUserAuth, checkUserPermissions, updateOrder);

  /**
* @openapi
* /api/v1/orders/{id}:
*   delete:
*     summary: Delete an order.
*     description: This endpoint allow to delete an order record by its id.
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
*                   example: DELETED
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
*                 msg:
*                   type: string
*                   example: Some error message.
*/
  router.delete(`${basePath}/:id`, verifyUserAuth, checkUserPermissions, deleteOrder);

  return router;
};
