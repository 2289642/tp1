import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import userRoutes from './routes/user.route';
import productRoutes from './routes/product.route';
import authRoutes from './routes/auth.route';
import { errorMiddleware } from './middlewares/error.middleware';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import https from 'https';
import http from 'http';
import { loadCertificate } from './middlewares/certificat.middleware';
import { config } from './config/config';
import session from 'express-session';
import fs from 'fs';

dotenv.config();

const app = express();

app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User API',
      version: '1.0.0',
      description: 'A simple API to manage users',
    },
  },
  apis: ['./src/routes/*.route.ts'],
};

app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: config.isProduction,
  }
}));

const swaggerDocs = swaggerJsdoc(swaggerOptions);

let certificatOptions = loadCertificate();

fetch('https://fakestoreapi.com/products/')
  .then(res => res.json())
  .then(json => fs.writeFileSync('./products.json', JSON.stringify(json, null, 2), 'utf-8'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express! Connexion sécurisée.');
});

app.use('/v1/', userRoutes);
app.use('/v1/', productRoutes);
app.use('/v1/users/', authRoutes);

app.use(errorMiddleware);

let server;
if (config.nodeEnv === 'development') {
  server = http.createServer(app);
} else {
  server = https.createServer(certificatOptions, app);
}

server.listen(config.port, () => {
  console.log(`Server is running in ${config.nodeEnv} mode on port ${config.port}`);
});

export default server;
