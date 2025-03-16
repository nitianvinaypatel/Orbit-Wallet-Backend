import { Request, Response } from 'express';
import * as userService from '../services/userService';
import connectDB from '../config/database';

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    // Ensure database connection in serverless environment
    if (process.env.NODE_ENV === 'production') {
      await connectDB();
    }
    
    const userId = req.params.id;
    const user = await userService.getUserById(userId);
    
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ success: false, message: errorMessage });
  }
}; 