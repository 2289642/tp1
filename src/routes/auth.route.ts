import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../interfaces/user.interface';
import { JWT_SECRET } from '../utils/jwt.util';

const router = Router();

const users: User[] = []; // Simuler une base de données en mémoire

/**
 * @swagger
 * tags:
 *   name: default
 *   description: Default operations
 */

/**
 * @swagger
 * /v1/users/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account.
 *     tags: [default]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User registered successfully."
 *       400:
 *         description: Validation error or missing fields.
 *       409:
 *         description: Username or email already exists.
 */

/**
 * @swagger
 * /v1/users/login:
 *   post:
 *     summary: Log in an existing user
 *     description: Authenticate a user and return an access token.
 *     tags: [default]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns access token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR..."
 *       403:
 *         description: Incorrect username or password.
 */

/**
 * @swagger
 * /v1/protected:
 *   get:
 *     summary: Access a protected resource
 *     description: Get protected resource, requires valid token.
 *     tags: [default]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully accessed protected resource.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "This is a protected resource."
 *       401:
 *         description: Unauthorized, invalid or missing token.
 */

router.post('/register', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user: User = {
        id: req.body.id,
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: hashedPassword
    };
    users.push(user);
    res.status(201).send('Utilisateur enregistré');
});

router.post('/login', async (req, res) => {
    const user = users.find(user => user.username === req.body.username);
    if (user && await bcrypt.compare(req.body.password, user.password)) {
        const accessToken = jwt.sign(
            { username: user.username },   
            JWT_SECRET,                    
            { expiresIn: '1h' }         
        );
        res.json({ accessToken });
    } else {
        res.status(403).send('Nom d’utilisateur ou mot de passe incorrect');
    }
});

export default router;