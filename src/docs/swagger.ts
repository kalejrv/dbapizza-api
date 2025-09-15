import { Application, Request, Response } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

const options: object = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "DBAPizza API",
      version: "1.0.0",
      description: "API with JWT authentication."
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{
      BearerAuth: [],
    }],
  },
  apis: [
    "./src/routes/*.ts",
    "./src/models/*.ts",
  ],
};

/* Docs in JSON format. */
const swaggerSpec = swaggerJSDoc(options);

/* Function to setup our docs. */
const swaggerDocs = (app: Application, port: number): void => {
  const url = "/api/v1";

  app.use(`${url}/docs`, swaggerUI.serve, swaggerUI.setup(swaggerSpec)); // Route-Handler to visit our docs.
  app.get(`${url}/docs.json`, (_req: Request, res: Response): void => { // Make our docs in JSON format available.
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log(`Version 1 Docs are available on http://localhost:${port}/api/v1/docs`);
};

export default swaggerDocs;
