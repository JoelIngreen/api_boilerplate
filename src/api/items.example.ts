import { Router } from 'express';
import type { Request, Response } from 'express';
import { ZodError } from 'zod';
import { ItemCreateSchema } from '../models/items.example.js';
import * as itemsService from '../services/items.service.example.js';

const router = Router();

/**
 * @swagger
 * /api/v1/items:
 *   get:
 *     summary: Get All Items
 *     description: Returns all items available in the store
 *     tags: [Items]
 *     responses:
 *       200:
 *         description: Successful response with all items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/items', async (_req: Request, res: Response): Promise<void> => {
  try {
    const items = await itemsService.getAllItems();
    res.json(items);
  } catch (error) {
    console.error('Error getting items:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/v1/items:
 *   post:
 *     summary: Create a New Item
 *     description: Adds a new item to the store and returns the created item with its new ID
 *     tags: [Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ItemCreate'
 *           example:
 *             name: "Wireless Mouse"
 *             category: "electronics"
 *             price: 45.99
 *     responses:
 *       201:
 *         description: Item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/items', async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = ItemCreateSchema.parse(req.body);
    const newItem = await itemsService.createNewItem(validatedData);
    res.status(201).json(newItem);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ 
        detail: 'Invalid request data', 
        errors: error.issues.map(issue => `${issue.path.join('.')} - ${issue.message}`)
      });
    } else {
      console.error('Error creating item:', error);
      res.status(500).json({ detail: 'Internal server error' });
    }
  }
});

/**
 * @swagger
 * /api/v1/items/{itemId}:
 *   get:
 *     summary: Get Item by ID
 *     description: Retrieve a single item by its unique integer ID
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The ID of the item to retrieve
 *         example: 1
 *     responses:
 *       200:
 *         description: Successful response with the item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       400:
 *         description: Invalid item ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/items/:itemId', async (req: Request<{ itemId: string }>, res: Response): Promise<void> => {
  try {
    const itemId = Number.parseInt(req.params.itemId, 10);
    
    if (Number.isNaN(itemId)) {
      res.status(400).json({ detail: 'Invalid item ID' });
      return;
    }
    
    const item = await itemsService.getItemById(itemId);
    
    if (!item) {
      res.status(404).json({ detail: 'Item not found' });
      return;
    }
    
    res.json(item);
  } catch (error) {
    console.error('Error getting item:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/v1/search/{category}/{maxPrice}:
 *   get:
 *     summary: Search for Items
 *     description: Search for items by category and a maximum price
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: The category to search for
 *         example: electronics
 *       - in: path
 *         name: maxPrice
 *         required: true
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: The maximum price of items to return
 *         example: 100.0
 *     responses:
 *       200:
 *         description: Successful response with matching items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 *       400:
 *         description: Invalid max price
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/search/:category/:maxPrice', async (req: Request<{ category: string; maxPrice: string }>, res: Response): Promise<void> => {
  try {
    const { category } = req.params;
    const maxPrice = Number.parseFloat(req.params.maxPrice);
    
    if (Number.isNaN(maxPrice)) {
      res.status(400).json({ detail: 'Invalid max price' });
      return;
    }
    
    const results = await itemsService.findItems(category, maxPrice);
    res.json(results);
  } catch (error) {
    console.error('Error searching items:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

export default router;