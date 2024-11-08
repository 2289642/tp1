import express, { Request, Response, NextFunction } from 'express';
import userRoutes from './routes/user.route';
import productRoutes from './routes/product.route';
import authRoutes from './routes/auth.route';
import { errorMiddleware } from './middlewares/error.middleware';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import https from 'https';
import { loadCertificate } from './middlewares/certificat.middleware';
import { config } from './config/config';
import session from 'express-session';
import fs from 'fs';


const app = express();
// Middleware de parsing du JSON
app.use(express.json());

// Définir les options de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
@@ -26,45 +28,47 @@ const swaggerOptions = {
      description: 'A simple API to manage users',
    },
  },
  apis: ['./src/routes/*.route.ts'], // Fichier où les routes de l'API sont définies
};

// Middleware de session avec la clé secrète provenant des variables de configuration
app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: config.isProduction, // Les cookies sécurisés ne sont activés qu'en production
  }
}));

// Générer la documentation à partir des options
const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Charger les certificats
let certificatOptions = loadCertificate();

fetch('https://fakestoreapi.com/products/')
            .then(res=>res.json())
            .then(json=> fs.writeFileSync('./products.json', JSON.stringify(json, null, 2), 'utf-8'))

// Servir la documentation Swagger via '/api-docs'
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Route de base
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express! Connexion sécurisée.');
});

app.use('/v1/', userRoutes);
app.use('/v1/', productRoutes);
app.use('/v1/users/',authRoutes);
  
app.use(errorMiddleware);

export default httpApp;
