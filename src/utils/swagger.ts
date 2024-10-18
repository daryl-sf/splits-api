import { Express, Request, Response } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import allTypes from '../schemas/allTypes.json';
import { version, description }  from '../../package.json';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Splits API',
      version,
      description,
      contact: {
        name: 'Splits API Support',
        email: 'darylfindlay@gmail.com',
      },
    },
    components: {
      schemas: allTypes.definitions, // Ensure this loads the schemas correctly
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['src/routes/*.ts', 'src/app.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express, port: string) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get('/docs.json', (_: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.json(swaggerSpec);
  });
  console.log(`📚 Swagger docs available at http://localhost:${port}/api-docs`);
};
