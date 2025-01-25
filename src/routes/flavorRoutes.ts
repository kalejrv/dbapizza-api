import { createFlavor, deleteFlavor, findFlavorById, findFlavors, updateFlavor } from "@controllers";
import { checkUserPermissions, verifyUserAuth } from "@middlewares";
import { Router } from "express";

const router = Router();
const basePath: string = "/flavors";

export const flavorRoutes = () => {
  /**
* @openapi
* /api/v1/flavors:
*   get:
*     summary: Find all flavors.
*     description: This endpoint allow to show all flavors records.
*     tags:
*       - Flavors
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
*                   type: array
*                   items: 
*                     $ref: "#/components/schemas/Flavor"
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
  router.get(`${basePath}`, verifyUserAuth, checkUserPermissions, findFlavors);

  /**
* @openapi
* /api/v1/flavors/{id}:
*   get:
*     summary: Find a flavor.
*     description: This endpoint allow to show a flavor record by its id.
*     tags:
*       - Flavors
*     security:
*       - BearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         description: A flavor id.
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
  router.get(`${basePath}/:id`, verifyUserAuth, checkUserPermissions, findFlavorById);
  
  /**
* @openapi
* /api/v1/flavors:
*   post:
*     summary: Create a flavor.
*     description: This endpoint allow to create a new flavor record.
*     tags:
*       - Flavors
*     security:
*       - BearerAuth: []
*     requestBody:
*       description: Request body with a new Flavor record.
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: "#/components/schemas/Flavor"
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
*                   example: Flavor created successfully.
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
  router.post(`${basePath}`, verifyUserAuth, checkUserPermissions, createFlavor);

  /**
* @openapi
* /api/v1/flavors/{id}:
*   patch:
*     summary: Update a flavor.
*     description: This endpoint allow to update a flavor record created by its id.
*     tags:
*       - Flavors
*     security:
*       - BearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         description: A flavor id.
*         required: true
*     requestBody:
*       description: Request body with flavor record updates.
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: "#/components/schemas/Flavor"
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
*                   example: Flavor updated successfully.
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
  router.patch(`${basePath}/:id`, verifyUserAuth, checkUserPermissions, updateFlavor);

  /**
* @openapi
* /api/v1/flavors/{id}:
*   delete:
*     summary: Delete a flavor.
*     description: This endpoint allow to delete a flavor record created by its id.
*     tags:
*       - Flavors
*     security:
*       - BearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         description: A flavor id.
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
*                   example: Flavor deleted successfully.
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
  router.delete(`${basePath}/:id`, verifyUserAuth, checkUserPermissions, deleteFlavor);

  return router;
};
