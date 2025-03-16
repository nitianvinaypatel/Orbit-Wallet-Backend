import mongoose, { Document, Schema } from 'mongoose';

export enum TransactionStatus {
  SUCCESS = 'success',
  PENDING = 'pending',
  FAILED = 'failed'
}

export enum TransactionType {
  DEBIT = 'debit',
  CREDIT = 'credit'
}

export interface ITransaction extends Document {
  status: TransactionStatus;
  type: TransactionType;
  transactionDate: Date;
  amount: number;
  userId: mongoose.Types.ObjectId;
}

const TransactionSchema: Schema = new Schema(
  {
    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      required: [true, 'Transaction status is required']
    },
    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: [true, 'Transaction type is required']
    },
    transactionDate: {
      type: Date,
      required: [true, 'Transaction date is required'],
      default: Date.now
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount must be a positive number']
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required']
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default mongoose.model<ITransaction>('Transaction', TransactionSchema); 