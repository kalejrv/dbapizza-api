import { createSize, deleteSize, findSizeById, findSizes, updateSize } from "@controllers";
import { checkUserPermissions, verifyUserAuth } from "@middlewares";
import { Router } from "express";

const router = Router();
const basePath: string = "/sizes";

export const sizeRoutes = () => {
  /**
* @openapi
* /api/v1/sizes:
*   get:
*     summary: Find all sizes.
*     description: This endpoint allow to show all sizes records.
*     tags:
*       - Sizes
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
*                     $ref: "#/components/schemas/Size"
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
  router.get(`${basePath}`, verifyUserAuth, checkUserPermissions, findSizes);

  /**
* @openapi
* /api/v1/sizes/{id}:
*   get:
*     summary: Find a size.
*     description: This endpoint allow to show a size record by its id.
*     tags:
*       - Sizes
*     security:
*       - BearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         description: A size id.
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
*                   $ref: "#/components/schemas/Size"
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
  router.get(`${basePath}/:id`, verifyUserAuth, checkUserPermissions, findSizeById);

  /**
* @openapi
* /api/v1/sizes:
*   post:
*     summary: Create a size.
*     description: This endpoint allow to create a new size record.
*     tags:
*       - Sizes
*     security:
*       - BearerAuth: []
*     requestBody:
*       description: Request body with a new Size record.
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: "#/components/schemas/Size"
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
*                   example: Size created successfully.
*                 data:
*                   type: object
*                   $ref: "#/components/schemas/Size"
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
  router.post(`${basePath}`, verifyUserAuth, checkUserPermissions, createSize);

  /**
* @openapi
* /api/v1/sizes/{id}:
*   patch:
*     summary: Update a size.
*     description: This endpoint allow to update a size record created by its id.
*     tags:
*       - Sizes
*     security:
*       - BearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         description: A size id.
*         required: true
*     requestBody:
*       description: Request body with size record updates.
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: "#/components/schemas/Size"
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
*                   example: Size updated successfully.
*                 data:
*                   type: object
*                   $ref: "#/components/schemas/Size"
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
  router.patch(`${basePath}/:id`, verifyUserAuth, checkUserPermissions, updateSize);

  /**
* @openapi
* /api/v1/sizes/{id}:
*   delete:
*     summary: Delete a size.
*     description: This endpoint allow to delete a size record created by its id.
*     tags:
*       - Sizes
*     security:
*       - BearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         description: A size id.
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
*                   example: Size deleted successfully.
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
  router.delete(`${basePath}/:id`, verifyUserAuth, checkUserPermissions, deleteSize);
  
  return router;
};
