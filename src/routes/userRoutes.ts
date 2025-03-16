import { Router } from 'express';
import * as userController from '../controllers/userController';

const router = Router();

// GET user by ID
router.get('/:id', userController.getUserById);

export default router; 