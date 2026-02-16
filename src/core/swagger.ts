import swaggerJsdoc from 'swagger-jsdoc';
import { settings } from './config.js';

const options: swaggerJsdoc.Options = {
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
      },
    },
  },
  apis: ['./src/api/*.ts', './src/index.ts'], // Path to the API docs
};

export const swaggerSpec = swaggerJsdoc(options);