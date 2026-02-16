import express from 'express';
import type { Request, Response } from 'express';

import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { settings } from './core/config.js';

// 👇 AÑADIR: Importar funciones de database
import { 
  initializeDatabase, 
  closeDatabaseConnection, 
  testConnection 
} from './core/database.js';

// Import routers
import itemsRouter from './api/items.example.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// **************************** DO NOT CHANGE ****************************

// 👇 AÑADIR: Inicializar base de datos al arrancar
if (settings.enableDatabase) {
  initializeDatabase();
}

// Swagger Configuration
const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Example API',
      version: '1.0.0',
      description: 'API for on-demand scripts',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: `http://localhost:${settings.apiPort}`,
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        ItemCreate: {
          type: 'object',
          required: ['name', 'category', 'price'],
          properties: {
            name: {
              type: 'string',
              example: 'Wireless Mouse',
              description: 'Name of the item',
            },
            category: {
              type: 'string',
              example: 'electronics',
              description: 'Category of the item',
            },
            price: {
              type: 'number',
              example: 49.99,
              description: 'Price of the item',
              minimum: 0,
            },
          },
        },
        Item: {
          allOf: [
            { $ref: '#/components/schemas/ItemCreate' },
            {
              type: 'object',
              required: ['id'],
              properties: {
                id: {
                  type: 'integer',
                  example: 5,
                  description: 'Unique identifier',
                },
              },
            },
          ],
        },
        Error: {
          type: 'object',
          properties: {
            detail: {
              type: 'string',
              example: 'Item not found',
            },
          },
        },
        ValidationError: {
          type: 'object',
          properties: {
            detail: {
              type: 'string',
              example: 'Invalid request data',
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/api/*.ts', './src/index.ts'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Swagger UI
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Example API Documentation',
}));

// OpenAPI JSON endpoint
app.get('/openapi.json', (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health Check
 *     description: Checks the health of the service and database connection status
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: healthy
 *                 database_status:
 *                   type: string
 *                   example: connected
 *       503:
 *         description: Service unhealthy - database connection failed
 */
// 👇 MODIFICAR: Health check con test de conexión real
app.get('/health', async (_req: Request, res: Response) => {
  if (!settings.enableDatabase) {
    res.json({
      status: 'healthy',
      database_status: 'disabled'
    });
    return;
  }

  // Test real de la conexión a base de datos
  const isConnected = await testConnection();
  
  if (isConnected) {
    res.json({
      status: 'healthy',
      database_status: 'connected'
    });
  } else {
    res.status(503).json({
      status: 'unhealthy',
      database_status: 'disconnected',
      detail: 'Database connection is not healthy'
    });
  }
});

// **************************** DO NOT CHANGE ****************************

/**
 * ************** INCLUDE YOUR CUSTOM ROUTER HERE ********************
 */

app.use('/api/v1', itemsRouter);

/**
 * ************** INCLUDE YOUR CUSTOM ROUTER HERE ********************
 */

// **************************** DO NOT CHANGE ****************************

// 👇 AÑADIR: Graceful shutdown para cerrar Prisma limpiamente
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await closeDatabaseConnection();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await closeDatabaseConnection();
  process.exit(0);
});

// Start server
const PORT = settings.apiPort;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 Swagger UI: http://localhost:${PORT}/docs`);
  console.log(`📄 OpenAPI Spec: http://localhost:${PORT}/openapi.json`);
  console.log(`📊 Database: ${settings.enableDatabase ? 'ENABLED (Prisma)' : 'DISABLED'}`);
  if (settings.databaseUrl) {
    console.log(`🔗 Database URL: ${settings.databaseUrl.replace(/:[^:@]+@/, ':****@')}`);
  }
});

// **************************** DO NOT CHANGE ****************************