import { Request, Response } from 'express';
import * as transactionService from '../services/transactionService';
import { TransactionStatus, TransactionType } from '../models/Transaction';
import connectDB from '../config/database';

// Helper function to ensure DB connection in serverless environment
const ensureDbConnection = async (): Promise<void> => {
  if (process.env.NODE_ENV === 'production') {
    await connectDB();
  }
};

export const getTransactionsByUserId = async (req: Request, res: Response): Promise<void> => {
  try {
    // Ensure database connection in serverless environment
    await ensureDbConnection();
    
    const userId = req.params.userId;
    
    // Parse query parameters
    const status = req.query.status as TransactionStatus | undefined;
    const type = req.query.type as TransactionType | undefined;
    const fromDate = req.query.fromDate ? new Date(req.query.fromDate as string) : undefined;
    const toDate = req.query.toDate ? new Date(req.query.toDate as string) : undefined;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
    
    // Validate status if provided
    if (status && !Object.values(TransactionStatus).includes(status)) {
      res.status(400).json({ 
        success: false, 
        message: `Invalid status. Must be one of: ${Object.values(TransactionStatus).join(', ')}` 
      });
      return;
    }
    
    // Validate type if provided
    if (type && !Object.values(TransactionType).includes(type)) {
      res.status(400).json({ 
        success: false, 
        message: `Invalid type. Must be one of: ${Object.values(TransactionType).join(', ')}` 
      });
      return;
    }
    
    const result = await transactionService.getTransactionsByUserId(userId, {
      status,
      type,
      fromDate,
      toDate,
      page,
      limit
    });
    
    res.status(200).json({ 
      success: true, 
      data: result.transactions,
      pagination: {
        totalCount: result.totalCount,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
        limit
      }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ success: false, message: errorMessage });
  }
};

export const getAllTransactionsWithUserDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    // Ensure database connection in serverless environment
    await ensureDbConnection();
    
    // Parse query parameters
    const status = req.query.status as TransactionStatus | undefined;
    const type = req.query.type as TransactionType | undefined;
    const fromDate = req.query.fromDate ? new Date(req.query.fromDate as string) : undefined;
    const toDate = req.query.toDate ? new Date(req.query.toDate as string) : undefined;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
    
    // Validate status if provided
    if (status && !Object.values(TransactionStatus).includes(status)) {
      res.status(400).json({ 
        success: false, 
        message: `Invalid status. Must be one of: ${Object.values(TransactionStatus).join(', ')}` 
      });
      return;
    }
    
    // Validate type if provided
    if (type && !Object.values(TransactionType).includes(type)) {
      res.status(400).json({ 
        success: false, 
        message: `Invalid type. Must be one of: ${Object.values(TransactionType).join(', ')}` 
      });
      return;
    }
    
    const result = await transactionService.getAllTransactionsWithUserDetails({
      status,
      type,
      fromDate,
      toDate,
      page,
      limit
    });
    
    res.status(200).json({ 
      success: true, 
      data: result.transactions,
      pagination: {
        totalCount: result.totalCount,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
        limit
      }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ success: false, message: errorMessage });
  }
}; 