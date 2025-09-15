import { Router } from "express";
import { createUser, deleteUser, findUserById, findUsers, updateUser } from "@controllers";
import { checkUserPermissions, verifyUserAuth } from "@middlewares";

const router = Router();
const basePath: string = "/users";

export const userRoutes = (): Router => {
  /**
* @openapi
* /api/v1/users:
*   get:
*     summary: Find all users.
*     description: This endpoint allow to show all users records.
*     tags:
*       - Users
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
*                     users:
*                      type: array
*                      items: 
*                        $ref: "#/components/schemas/User"
*                     totalUsers:
*                       type: number
*                       example: 50
*                     usersByPage:
*                       type: number
*                       example: 10
*                     currentUsersQuantity:
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
  router.get(`${basePath}`, verifyUserAuth, checkUserPermissions, findUsers);

  /**
* @openapi
* /api/v1/users/{id}:
*   get:
*     summary: Find a user.
*     description: This endpoint allow to show a user record by its id.
*     tags:
*       - Users
*     security:
*       - BearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         description: A user id.
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
*                   $ref: "#/components/schemas/User"
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
  router.get(`${basePath}/:id`, verifyUserAuth, checkUserPermissions, findUserById);
  
  /**
* @openapi
* /api/v1/users:
*   post:
*     summary: Create a user.
*     description: This endpoint allow to create a new user record.
*     tags:
*       - Users
*     security:
*       - BearerAuth: []
*     requestBody:
*       description: Request body with a new user record.
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: "#/components/schemas/User"
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
*                   example: User created successfully.
*                 data:
*                   type: object
*                   $ref: "#/components/schemas/User"
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
  router.post(`${basePath}`, verifyUserAuth, checkUserPermissions, createUser);
  
  /**
* @openapi
* /api/v1/users/{id}:
*   patch:
*     summary: Update a user.
*     description: This endpoint allow to update a user record created by its id.
*     tags:
*       - Users
*     security:
*       - BearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         description: A user id.
*         required: true
*     requestBody:
*       description: Request body with user record updates.
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: "#/components/schemas/User"
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
*                   example: User updated successfully.
*                 data:
*                   type: object
*                   $ref: "#/components/schemas/User"
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
  router.patch(`${basePath}/:id`, verifyUserAuth, checkUserPermissions, updateUser);
  
  /**
* @openapi
* /api/v1/users/{id}:
*   delete:
*     summary: Delete a user.
*     description: This endpoint allow to delete a user record created by its id.
*     tags:
*       - Users
*     security:
*       - BearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         description: A user id.
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
*                   example: User deleted successfully.
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
  router.delete(`${basePath}/:id`, verifyUserAuth, checkUserPermissions, deleteUser);
  
  return router;
};
