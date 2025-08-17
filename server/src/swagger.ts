import swaggerJsdoc from 'swagger-jsdoc';
import { ENV } from './config/env';

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'Auth Demo API', version: '1.0.0' },
    servers: [{ url: `http://localhost:${ENV.PORT}` }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: []
});
