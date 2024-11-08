import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import { IProduct } from '../interfaces/product.interface';
const logger = require('../utils/logger'); 

export class ProductController {

    static async getProducts(req: Request, res: Response) {
        const { minPrice, maxPrice, minStock, maxStock } = req.query;

        const minPriceNum = minPrice ? parseFloat(minPrice as string) : undefined;
        const maxPriceNum = maxPrice ? parseFloat(maxPrice as string) : undefined;
        const minStockNum = minStock ? parseInt(minStock as string) : undefined;
        const maxStockNum = maxStock ? parseInt(maxStock as string) : undefined;

        if (
            (minPrice && isNaN(minPriceNum!)) ||
            (maxPrice && isNaN(maxPriceNum!)) ||
            (minStock && isNaN(minStockNum!)) ||
            (maxStock && isNaN(maxStockNum!))
        ) {
            logger.warn('Invalid query parameters');
            return res.status(400).json({ error: 'Invalid query parameters' });
        }

        let products: IProduct[] = await ProductService.getAllProducts();

        if (minPriceNum || maxPriceNum || minStockNum || maxStockNum) {
            logger.info('Filtering products based on query parameters');
            products = await ProductService.filterProducts(minPriceNum, maxPriceNum, minStockNum, maxStockNum);
        }

        logger.info('Fetched products');
        return res.status(200).json(products);
    }

    static async createProduct(req: Request, res: Response) {
        const { id, title, description, price, category, image, rating } = req.body;
        const titleRegex = /^.{3,50}$/; 
        const priceRegex = /^(0|[1-9][0-9]*)(\.[0-9]+)?$/;
        const countRegex = /^[1-9][0-9]*$/;

        if (
            !titleRegex.test(title) ||
            !priceRegex.test(price.toString()) ||
            !countRegex.test(rating.count.toString())
        ) {
            logger.warn('Validation error: Invalid product data');
            return res.status(400).json({ error: 'Validation error: Invalid product data' });
        }

        const newProduct: IProduct = {
            id,
            title,
            description,
            price,
            category,
            image,
            rating
        };

        await ProductService.addProduct(newProduct);
        logger.info(`Product created with ID: ${id}`);
        return res.status(201).json(newProduct);
    }

    static async getProductById(req: Request, res: Response) {
        const { id } = req.params;

        const product = await ProductService.getProductById(parseInt(id));
        if (!product) {
            logger.warn(`Product not found with ID: ${id}`);
            return res.status(404).json({ error: 'Product not found' });
        }

        logger.info(`Fetched product with ID: ${id}`);
        return res.status(200).json(product);
    }

    static async updateProduct(req: Request, res: Response) {
        const { id } = req.params;
        const { title, description, price, count } = req.body;

        const titleRegex = /^.{3,50}$/;
        const priceRegex = /^[0-9]*\.?[0-9]+$/;
        const countRegex = /^[1-9][0-9]*$/;

        if (title && !titleRegex.test(title)) {
            logger.warn('Validation error: Invalid title');
            return res.status(400).json({ error: 'Validation error: Invalid title' });
        }
        if (price && !priceRegex.test(price.toString())) {
            logger.warn('Validation error: Invalid price');
            return res.status(400).json({ error: 'Validation error: Invalid price' });
        }
        if (count && !countRegex.test(count.toString())) {
            logger.warn('Validation error: Invalid count');
            return res.status(400).json({ error: 'Validation error: Invalid count' });
        }

        const productToUpdate = await ProductService.getProductById(parseInt(id)); 

        if (!productToUpdate) {
            logger.warn(`Product not found with ID: ${id}`);
            return res.status(404).json({ error: 'Product not found' });
        }

        const updatedProduct: IProduct = {
            ...productToUpdate,
            title: title ?? productToUpdate.title,
            description: description ?? productToUpdate.description,
            price: price ?? productToUpdate.price,
            rating: { ...productToUpdate.rating, count: count ?? productToUpdate.rating.count }
        };

        await ProductService.updateProduct(updatedProduct);
        logger.info(`Product updated with ID: ${id}`);
        return res.status(200).json(updatedProduct);
    }

    static async deleteProduct(req: Request, res: Response) {
        const { id } = req.params;

        const productExists = await ProductService.getProductById(parseInt(id));

        if (!productExists) {
            logger.warn(`Product not found with ID: ${id}`);
            return res.status(404).json({ error: 'Product not found' });
        }

        await ProductService.deleteProduct(parseInt(id));
        logger.info(`Product deleted with ID: ${id}`);
        return res.status(204).send(); 
    }
}
