import express from 'express';
import cors from 'cors';
import { ENV } from './config/env';
import { connectDB } from './db';
import authRoutes from './routes/auth';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';

async function main() {
  await connectDB();

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => res.json({ ok: true }));

  const basicSpec = {
    ...swaggerSpec,
    paths: {
      '/api/auth/register': {
        post: {
          summary: 'Create user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string' },
                    password: { type: 'string', minLength: 6 }
                  },
                  required: ['email', 'password']
                }
              }
            }
          },
          responses: {
            '201': { description: 'Created' },
            '409': { description: 'Email in use' },
            '400': { description: 'Bad request' }
          }
        }
      },
      '/api/auth/login': {
        post: {
          summary: 'Login',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string' },
                    password: { type: 'string' }
                  },
                  required: ['email', 'password']
                }
              }
            }
          },
          responses: {
            '200': { description: 'OK' },
            '401': { description: 'Invalid credentials' },
            '400': { description: 'Bad request' }
          }
        }
      },
      '/api/auth/account': {
        get: {
          summary: 'Current user',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': { description: 'OK' },
            '401': { description: 'Unauthorized' }
          }
        }
      }
    }
  };

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(basicSpec as any));
  app.use('/api/auth', authRoutes);

  app.listen(ENV.PORT, () =>
    console.log(`API http://localhost:${ENV.PORT}  |  Swagger: http://localhost:${ENV.PORT}/docs`)
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
