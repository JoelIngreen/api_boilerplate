/**
 * ****************************** This is an example service ******************************
 */

import type { ItemCreate, Item } from '../models/items.example.js';
import { settings } from '../core/config.js';
import { getPrisma } from '../core/database.js';

// In-memory "database" (usado cuando DB está deshabilitada)
const DUMMY_ITEMS: Map<number, ItemCreate> = new Map([
  [1, { name: "Laptop", category: "electronics", price: 1200.50 }],
  [2, { name: "Keyboard", category: "electronics", price: 75.00 }],
  [3, { name: "Book - FastAPI Guide", category: "books", price: 25.99 }],
  [4, { name: "Office Chair", category: "furniture", price: 150.75 }]
]);

/**
 * Returns all items
 * Uses Prisma if DB is enabled, otherwise in-memory Map
 */
export async function getAllItems(): Promise<Item[]> {
  if (!settings.enableDatabase) {
    // In-memory version: Convert Map to array
    const items: Item[] = [];
    DUMMY_ITEMS.forEach((value, key) => {
      items.push({ id: key, ...value });
    });
    return items;
  }

  // Database version with Prisma
  const prisma = getPrisma();
  return await prisma.item.findMany({
    orderBy: { id: 'asc' }
  });
}

/**
 * Creates a new item
 */
export async function createNewItem(itemData: ItemCreate): Promise<Item> {
  if (!settings.enableDatabase) {
    // In-memory version
    const newId = DUMMY_ITEMS.size > 0 
      ? Math.max(...Array.from(DUMMY_ITEMS.keys())) + 1 
      : 1;
    DUMMY_ITEMS.set(newId, itemData);
    return { id: newId, ...itemData };
  }

  // Database version with Prisma
  const prisma = getPrisma();
  return await prisma.item.create({
    data: itemData
  });
}

/**
 * Retrieves a single item by its ID
 */
export async function getItemById(itemId: number): Promise<Item | null> {
  if (!settings.enableDatabase) {
    // In-memory version
    const item = DUMMY_ITEMS.get(itemId);
    return item ? { id: itemId, ...item } : null;
  }

  // Database version with Prisma
  const prisma = getPrisma();
  return await prisma.item.findUnique({
    where: { id: itemId }
  });
}

/**
 * Finds items matching a specific category and maximum price
 */
export async function findItems(category: string, maxPrice: number): Promise<Item[]> {
  if (!settings.enableDatabase) {
    // In-memory version
    const results: Item[] = [];
    DUMMY_ITEMS.forEach((item, itemId) => {
      if (item.category === category && item.price <= maxPrice) {
        results.push({ id: itemId, ...item });
      }
    });
    return results;
  }

  // Database version with Prisma
  const prisma = getPrisma();
  return await prisma.item.findMany({
    where: {
      category,
      price: { lte: maxPrice }
    },
    orderBy: { id: 'asc' }
  });
}

/**
 * ****************************** This is an example service ******************************
 */