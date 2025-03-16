import { Router } from 'express';
import * as transactionController from '../controllers/transactionController';

const router = Router();

// GET transactions by user ID
router.get('/user/:userId', transactionController.getTransactionsByUserId);

// GET all transactions with user details
router.get('/', transactionController.getAllTransactionsWithUserDetails);

export default router; 