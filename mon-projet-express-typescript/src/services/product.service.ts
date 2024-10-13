import { IProduct } from '../interfaces/product.interface';
import { Product } from '../models/product.model';
import * as fs from 'fs';
import * as path from 'path';

export class ProductService {
    private static products: Product[] = [];

    private static loadProductsFromFile(): void {
        const filePath = path.resolve(__dirname, '../../products.json');
        const data = fs.readFileSync(filePath, 'utf-8');
        const jsonData: IProduct[] = JSON.parse(data);

        this.products = jsonData.map(product => new Product(
            product.id,
            product.title,
            product.price,
            product.description,
            product.category,
            product.image,
            product.rating
        ));
    }

    private static initialize(): void {
        if (this.products.length === 0) {
            this.loadProductsFromFile();
        }
    }

    public static async getAllProducts(): Promise<IProduct[]> {
        this.initialize();
        return this.products;
    }

    public static async filterProducts(
        minPrice?: number,
        maxPrice?: number,
        minStock?: number,
        maxStock?: number
    ): Promise<IProduct[]> {
        this.initialize();

        return this.products.filter(product => {
            return (
                (minPrice === undefined || product.price >= minPrice) &&
                (maxPrice === undefined || product.price <= maxPrice) &&
                (minStock === undefined || product.rating.count >= minStock) &&
                (maxStock === undefined || product.rating.count <= maxStock)
            );
        });
    }

    public static async addProduct(newProduct: IProduct): Promise<void> {
        this.initialize(); 

        this.products.push(new Product(
            newProduct.id,
            newProduct.title,
            newProduct.price,
            newProduct.description,
            newProduct.category,
            newProduct.image,
            newProduct.rating
        ));

        this.saveProductsToFile();
    }

    private static saveProductsToFile(): void {
        const filePath = path.resolve(__dirname, '../../products.json');
        fs.writeFileSync(filePath, JSON.stringify(this.products, null, 2), 'utf-8');
    }

    public static async getProductById(id: number): Promise<IProduct | undefined> {
        this.initialize();
        return this.products.find(product => product.id === id);
    }

    public static async updateProduct(updatedProduct: IProduct): Promise<void> {
        this.initialize();
        const index = this.products.findIndex(product => product.id === updatedProduct.id);
        if (index !== -1) {
            this.products[index] = updatedProduct; 
            await this.saveProductsToFile(); 
        }
    }

    public static async deleteProduct(id: number): Promise<void> {
        this.initialize();

        this.products = this.products.filter(product => product.id !== id);

        const filePath = path.resolve(__dirname, '../../products.json');
        fs.writeFileSync(filePath, JSON.stringify(this.products, null, 2));
    }
    
}
