# Orbit-Wallet Backend Assignment

A Node.js REST API for managing users and transactions with MongoDB.

## Features

- Get user details by ID
- Get all transactions for a user with filtering options
- Get all transactions with user details and filtering options
- MongoDB integration with Mongoose
- TypeScript support
- Pagination for transaction endpoints
- MongoDB aggregation framework for efficient queries

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB instance)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/nitianvinaypatel/Orbit-Wallet-Backend.git

```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:
   - Create a `.env` file in the root directory
   - Add the following variables:

```
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/transaction-api
```

- Replace `<username>` and `<password>` with your MongoDB Atlas credentials

## Usage

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

### Seed Database

To populate the database with sample data (10 users with 5 transactions each):

```bash
npm run seed
```

## API Endpoints

### Users

- **GET /api/users/:id** - Get user details by ID

### Transactions

- **GET /api/transactions/user/:userId** - Get all transactions for a user

  - Query parameters:
    - `status` (optional): Filter by status (success, pending, failed)
    - `type` (optional): Filter by type (debit, credit)
    - `fromDate` (optional): Filter by date range (start date)
    - `toDate` (optional): Filter by date range (end date)
    - `page` (optional): Page number for pagination (default: 1)
    - `limit` (optional): Number of items per page (default: 10)

- **GET /api/transactions** - Get all transactions with user details
  - Query parameters:
    - `status` (optional): Filter by status (success, pending, failed)
    - `type` (optional): Filter by type (debit, credit)
    - `fromDate` (optional): Filter by date range (start date)
    - `toDate` (optional): Filter by date range (end date)
    - `page` (optional): Page number for pagination (default: 1)
    - `limit` (optional): Number of items per page (default: 10)

## Example Requests

### Get User by ID

```
GET /api/users/60d21b4667d0d8992e610c85
```

### Get Transactions for a User

```
GET /api/transactions/user/60d21b4667d0d8992e610c85?status=success&type=credit&fromDate=2023-01-01&toDate=2023-12-31&page=1&limit=10
```

### Get All Transactions with User Details

```
GET /api/transactions?status=pending&type=debit&page=2&limit=5
```

## Project Structure

```
transaction-api/
├── src/
│   ├── config/
│   │   └── database.ts
│   ├── controllers/
│   │   ├── userController.ts
│   │   └── transactionController.ts
│   ├── models/
│   │   ├── User.ts
│   │   └── Transaction.ts
│   ├── routes/
│   │   ├── userRoutes.ts
│   │   └── transactionRoutes.ts
│   ├── services/
│   │   ├── userService.ts
│   │   └── transactionService.ts
│   ├── utils/
│   │   ├── errorHandler.ts
│   │   └── seedData.ts
│   └── index.ts
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```
