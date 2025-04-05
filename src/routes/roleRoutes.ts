import { createRole, deleteRole, findRoleById, findRoles, updateRole } from "@controllers";
import { checkUserPermissions, verifyUserAuth } from "@middlewares";
import { Router } from "express";

const router = Router();
const basePath: string = "/roles";

export const roleRoutes = () => {
  /**
* @openapi
* /api/v1/roles:
*   get:
*     summary: Find all roles.
*     description: This endpoint allow to show all roles records.
*     tags:
*       - Roles
*     security:
*       - BearerAuth: []
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
*                   $ref: "#/components/schemas/Role"
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
*                  type: string
*                  example: Some error.
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
  router.get(`${basePath}`, verifyUserAuth, checkUserPermissions, findRoles);
  
  /**
* @openapi
* /api/v1/roles/{id}:
*   get:
*     summary: Find a role.
*     description: This endpoint allow to show a role record by its id.
*     tags:
*       - Roles
*     security:
*       - BearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         description: A role id.
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
*                   $ref: "#/components/schemas/Role"
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
  router.get(`${basePath}/:id`, verifyUserAuth, checkUserPermissions, findRoleById);

  /**
* @openapi
* /api/v1/roles:
*   post:
*     summary: Create a role.
*     description: This endpoint allow to create a new role record.
*     tags:
*       - Roles
*     security:
*       - BearerAuth: []
*     requestBody:
*       description: Request body with a new role record.
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: "#/components/schemas/Role"
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
*                   example: Already exists 'role_name' as a role.
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
*                   example: Role created successfully.
*                 data:
*                   type: object
*                   $ref: "#/components/schemas/Role"
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
  router.post(`${basePath}`, verifyUserAuth, checkUserPermissions, createRole);

  /**
* @openapi
* /api/v1/roles/{id}:
*   patch:
*     summary: Update a role.
*     description: This endpoint allow to update a role record created by its id.
*     tags:
*       - Roles
*     security:
*       - BearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         description: A role id.
*         required: true
*     requestBody:
*       description: Request body with role record updates.
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: "#/components/schemas/Role"
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
*                   example: Role updated successfully.
*                 data:
*                   type: object
*                   $ref: "#/components/schemas/Role"
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
  router.patch(`${basePath}/:id`, verifyUserAuth, checkUserPermissions, updateRole);
  
  /**
* @openapi
* /api/v1/roles/{id}:
*   delete:
*     summary: Delete a role.
*     description: This endpoint allow to delete a role record created by its id.
*     tags:
*       - Roles
*     security:
*       - BearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         description: A role id.
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
*                   example: Role deleted successfully.
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
  router.delete(`${basePath}/:id`, verifyUserAuth, checkUserPermissions, deleteRole);

  return router;
};
