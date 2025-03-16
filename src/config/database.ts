import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Global variable to track connection status
let isConnected = false;
let connectionPromise: Promise<typeof mongoose> | null = null;

const connectDB = async (): Promise<void> => {
  // If already connected, return
  if (isConnected) {
    console.log('Using existing database connection');
    return;
  }

  // If connection is in progress, wait for it
  if (connectionPromise) {
    console.log('Waiting for existing connection promise');
    await connectionPromise;
    return;
  }

  try {
    const mongoURI = process.env.MONGODB_URI as string;
    
    if (!mongoURI) {
      throw new Error('MongoDB connection string is not defined in environment variables');
    }
    
    console.log('Connecting to MongoDB...');
    
    const options = {
      serverSelectionTimeoutMS: 15000, // Increased from 5000
      connectTimeoutMS: 30000, // Increased from 10000
      socketTimeoutMS: 60000, // Increased from 45000
    };
    
    // Create a promise for the connection
    connectionPromise = mongoose.connect(mongoURI, options);
    
    // Wait for connection
    await connectionPromise;
    isConnected = true;
    console.log('Connected to MongoDB');
    
    // Clear the promise
    connectionPromise = null;
  } catch (error) {
    // Clear the promise on error
    connectionPromise = null;
    console.error('MongoDB connection error:', error);
    
    // Don't exit process in production - just log the error
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};

export default connectDB; 