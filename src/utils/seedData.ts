import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User, { IUser } from '../models/User';
import Transaction, { ITransaction, TransactionStatus, TransactionType } from '../models/Transaction';
import connectDB from '../config/database';

dotenv.config();

// Function to generate random transactions for a user
const generateTransactionsForUser = (userId: mongoose.Types.ObjectId, count = 5): Partial<ITransaction>[] => {
  const transactions: Partial<ITransaction>[] = [];
  const statuses = Object.values(TransactionStatus);
  const types = Object.values(TransactionType);
  
  // Generate transactions for the past 30 days
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  for (let i = 0; i < count; i++) {
    // Random date between now and 30 days ago
    const transactionDate = new Date(
      thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime())
    );
    
    transactions.push({
      status: statuses[Math.floor(Math.random() * statuses.length)],
      type: types[Math.floor(Math.random() * types.length)],
      transactionDate,
      amount: parseFloat((Math.random() * 1000).toFixed(2)),
      userId
    });
  }
  
  return transactions;
};

// Seed data function
const seedData = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await User.deleteMany({});
    await Transaction.deleteMany({});
    
    console.log('Previous data cleared');
    
    // Create 10 users
    const users = [];
    for (let i = 1; i <= 10; i++) {
      users.push({
        name: `User ${i}`,
        phoneNumber: `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`
      });
    }
    
    const createdUsers = await User.insertMany(users);
    console.log(`${createdUsers.length} users created`);
    
    // Create transactions for each user
    let allTransactions: Partial<ITransaction>[] = [];
    for (const user of createdUsers) {
      // Ensure user._id is treated as a mongoose ObjectId
      const userTransactions = generateTransactionsForUser(user._id as unknown as mongoose.Types.ObjectId);
      allTransactions = [...allTransactions, ...userTransactions];
    }
    
    const createdTransactions = await Transaction.insertMany(allTransactions);
    console.log(`${createdTransactions.length} transactions created`);
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedData();
