import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: default
 *   description: Default operations
 */

/**
 * @swagger
 * /v1/products:
 *   get:
 *     summary: Retrieve a list of products
 *     description: Retrieve a list of products from v1. Can be filtered by price and stock.
 *     tags: [default]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: minPrice
 *         required: false
 *         schema:
 *           type: number
 *           example: 10.00
 *         description: Minimum price of the product.
 *       - in: query
 *         name: maxPrice
 *         required: false
 *         schema:
 *           type: number
 *           example: 100.00
 *         description: Maximum price of the product.
 *       - in: query
 *         name: minStock
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Minimum stock quantity of the product.
 *       - in: query
 *         name: maxStock
 *         required: false
 *         schema:
 *           type: integer
 *           example: 100
 *         description: Maximum stock quantity of the product.
 *     responses:
 *       200:
 *         description: A list of products.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   title:
 *                     type: string
 *                     example: "Sample Product"
 *                   description:
 *                     type: string
 *                     example: "This is a sample product."
 *                   price:
 *                     type: number
 *                     example: 29.99
 *                   category:
 *                     type: string
 *                     example: "Electronics"
 *                   image:
 *                     type: string
 *                     example: "http://example.com/image.jpg"
 *                   rating:
 *                     type: object
 *                     properties:
 *                       rate:
 *                         type: number
 *                         example: 4.5
 *                       count:
 *                         type: integer
 *                         example: 150
 *       400:
 *         description: Invalid query parameters.

 *   post:
 *     summary: Create a new product
 *     description: Add a new product to the store.
 *     tags: [default]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               image:
 *                 type: string
 *               rating:
 *                 type: object
 *                 properties:
 *                   rate:
 *                     type: number
 *                   count:
 *                     type: integer
 *     responses:
 *       201:
 *         description: The product was created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 price:
 *                   type: number
 *                 category:
 *                   type: string
 *                 image:
 *                   type: string
 *                 rating:
 *                   type: object
 *                   properties:
 *                     rate:
 *                       type: number
 *                     count:
 *                       type: integer
 *       400:
 *         description: Validation error.
 */

/**
 * @swagger
 * /v1/products/{id}:
 *   get:
 *     summary: Retrieve a product by ID
 *     description: Get detailed information about a specific product.
 *     tags: [default]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: The ID of the product to retrieve.
 *     responses:
 *       200:
 *         description: The product details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 title:
 *                   type: string
 *                   example: "Sample Product"
 *                 description:
 *                   type: string
 *                   example: "This is a sample product."
 *                 price:
 *                   type: number
 *                   example: 29.99
 *                 category:
 *                   type: string
 *                   example: "Electronics"
 *                 image:
 *                   type: string
 *                   example: "http://example.com/image.jpg"
 *                 rating:
 *                   type: object
 *                   properties:
 *                     rate:
 *                       type: number
 *                       example: 4.5
 *                     count:
 *                       type: integer
 *                       example: 150
 *       404:
 *         description: Product not found.

 *   put:
 *     summary: Update a product by ID
 *     description: Modify the details of an existing product.
 *     tags: [default]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: The ID of the product to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               image:
 *                 type: string
 *               rating:
 *                 type: object
 *                 properties:
 *                   rate:
 *                     type: number
 *                   count:
 *                     type: integer
 *     responses:
 *       200:
 *         description: The product was updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 price:
 *                   type: number
 *                 category:
 *                   type: string
 *                 image:
 *                   type: string
 *                 rating:
 *                   type: object
 *                   properties:
 *                     rate:
 *                       type: number
 *                     count:
 *                       type: integer
 *       400:
 *         description: Validation error.
 *       404:
 *         description: Product not found.

 *   delete:
 *     summary: Delete a product by ID
 *     description: Remove a product from the store.
 *     tags: [default]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: The ID of the product to delete.
 *     responses:
 *       204:
 *         description: Product deleted successfully (no content).
 *       404:
 *         description: Product not found.
 * 
 */

router.get('/products',verifyToken, ProductController.getProducts);
router.post('/products',verifyToken, ProductController.createProduct);  
router.get('/products/:id',verifyToken, ProductController.getProductById);
router.put('/products/:id',verifyToken, ProductController.updateProduct);
router.delete('/products/:id',verifyToken, ProductController.deleteProduct);

export default router;
