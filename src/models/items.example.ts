import { z } from 'zod';
import type { Item as PrismaItem } from '@prisma/client';

/**
 * Schema for creating a new item (without ID)
 */
export const ItemCreateSchema = z.object({
  name: z.string().min(1).describe('Name of the item'),
  category: z.string().min(1).describe('Category of the item'),
  price: z.number().positive().describe('Price of the item')
});

/**
 * Schema for an item with ID
 */
export const ItemSchema = ItemCreateSchema.extend({
  id: z.number().int().positive().describe('Unique identifier')
});

// TypeScript types derived from schemas
export type ItemCreate = z.infer<typeof ItemCreateSchema>;

// Use Prisma's generated type when DB is enabled, otherwise use Zod type
export type Item = PrismaItem | (ItemCreate & { id: number });

// Example data for OpenAPI/Swagger documentation
export const ItemCreateExample: ItemCreate = {
  name: "Wireless Mouse",
  category: "electronics",
  price: 49.99
};

export const ItemExample: Item = {
  id: 5,
  name: "Wireless Mouse",
  category: "electronics",
  price: 49.99
};