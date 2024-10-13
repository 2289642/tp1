import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { roleMiddleware } from '../middlewares/roles.middleware';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();
const userController = new UserController();

router.get('/users', userController.getAllUsers);

router.get('/admin', verifyToken, roleMiddleware(['admin']), UserController.getAdminData);

export default router;