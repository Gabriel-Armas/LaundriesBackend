import swaggerJSDoc from "swagger-jsdoc";
import path from "path";

const options: any = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Auth API",
      version: "1.0.0",
      description: "API de autenticación con arquitectura hexagonal",
    },
    servers: [
      {
        url: "http://localhost:5500",
      },
    ],
  },
  apis: [path.join(__dirname, "../interfaces/http/express/routes/*.ts")],
};

export const swaggerSpec = swaggerJSDoc(options);
