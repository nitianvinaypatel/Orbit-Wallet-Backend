import Transaction, { ITransaction, TransactionStatus, TransactionType } from '../models/Transaction';
import mongoose, { PipelineStage } from 'mongoose';

interface TransactionFilters {
  status?: TransactionStatus;
  type?: TransactionType;
  fromDate?: Date;
  toDate?: Date;
  page?: number;
  limit?: number;
}

interface TransactionResult {
  transactions: ITransaction[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export const getTransactionsByUserId = async (
  userId: string,
  filters: TransactionFilters = {}
): Promise<TransactionResult> => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID format');
  }

  const { status, type, fromDate, toDate, page = 1, limit = 10 } = filters;
  const skip = (page - 1) * limit;

  // Build match stage for aggregation
  const matchStage: any = { userId: new mongoose.Types.ObjectId(userId) };
  
  if (status) {
    matchStage.status = status;
  }
  
  if (type) {
    matchStage.type = type;
  }
  
  if (fromDate || toDate) {
    matchStage.transactionDate = {};
    
    if (fromDate) {
      matchStage.transactionDate.$gte = new Date(fromDate);
    }
    
    if (toDate) {
      matchStage.transactionDate.$lte = new Date(toDate);
    }
  }

  // Aggregation pipeline
  const pipeline: PipelineStage[] = [
    { $match: matchStage },
    {
      $facet: {
        transactions: [
          { $sort: { transactionDate: -1 } },
          { $skip: skip },
          { $limit: limit }
        ],
        totalCount: [
          { $count: 'count' }
        ]
      }
    }
  ];

  const result = await Transaction.aggregate(pipeline);
  
  const transactions = result[0].transactions || [];
  const totalCount = result[0].totalCount.length > 0 ? result[0].totalCount[0].count : 0;
  const totalPages = Math.ceil(totalCount / limit);

  return {
    transactions,
    totalCount,
    totalPages,
    currentPage: page
  };
};

export const getAllTransactionsWithUserDetails = async (
  filters: TransactionFilters = {}
): Promise<TransactionResult> => {
  const { status, type, fromDate, toDate, page = 1, limit = 10 } = filters;
  const skip = (page - 1) * limit;

  // Build match stage for aggregation
  const matchStage: any = {};
  
  if (status) {
    matchStage.status = status;
  }
  
  if (type) {
    matchStage.type = type;
  }
  
  if (fromDate || toDate) {
    matchStage.transactionDate = {};
    
    if (fromDate) {
      matchStage.transactionDate.$gte = new Date(fromDate);
    }
    
    if (toDate) {
      matchStage.transactionDate.$lte = new Date(toDate);
    }
  }

  // Aggregation pipeline
  const pipeline: PipelineStage[] = [
    { $match: matchStage },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user'
      }
    },
    { $unwind: '$user' },
    {
      $facet: {
        transactions: [
          { $sort: { transactionDate: -1 } },
          { $skip: skip },
          { $limit: limit }
        ],
        totalCount: [
          { $count: 'count' }
        ]
      }
    }
  ];

  const result = await Transaction.aggregate(pipeline);
  
  const transactions = result[0].transactions || [];
  const totalCount = result[0].totalCount.length > 0 ? result[0].totalCount[0].count : 0;
  const totalPages = Math.ceil(totalCount / limit);

  return {
    transactions,
    totalCount,
    totalPages,
    currentPage: page
  };
};

export const createTransaction = async (transactionData: Partial<ITransaction>): Promise<ITransaction> => {
  return await Transaction.create(transactionData);
}; 