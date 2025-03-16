import User, { IUser } from '../models/User';
import mongoose from 'mongoose';

export const getUserById = async (userId: string): Promise<IUser | null> => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID format');
  }
  
  return await User.findById(userId);
};

export const createUser = async (userData: Partial<IUser>): Promise<IUser> => {
  return await User.create(userData);
};

export const getAllUsers = async (): Promise<IUser[]> => {
  return await User.find();
}; 