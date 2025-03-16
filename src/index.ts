import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database';
import userRoutes from './routes/userRoutes';
import transactionRoutes from './routes/transactionRoutes';
import { errorHandler } from './utils/errorHandler';

// Load environment variables
dotenv.config();

// Log environment for debugging
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);

// Initialize express app
const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB().catch(console.error);

// Simple request logger for debugging
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
  });
  next();
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Root route
app.get('/', (req: Request, res: Response) => {
  res.status(200).send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Orbit Wallet API Documentation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            padding: 20px;
            background-color: #f9f9f9;
        }
        h1, h2 {
            color: #333;
        }
        .endpoint {
            background: #fff;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            margin-bottom: 1rem;
        }
        .method {
            font-weight: bold;
            color: #0066cc;
        }
        .code {
            background: #f5f5f5;
            padding: 0.5rem;
            border-radius: 4px;
            font-family: monospace;
        }
    </style>
</head>
<body>
    <h1>Orbit Wallet API</h1>
    <p>Welcome to the Orbit Wallet API. This is the backend service for the Orbit Wallet application.</p>
    
    <h2>Base URL</h2>
    <p class="code">https://orbitwallet.vercel.app</p>

        <h2>Testing in Postman</h2>
    <p>You can test these API endpoints in Postman by forking the following collection:</p>
    <p class="code"><a href="https://www.postman.com/platform-api-7015/workspace/orbit-wallet-backend/request/33656587-a94102a2-d48a-4a49-974b-b35631df1719?action=share&creator=33656587&ctx=documentation" target="_blank">Fork Orbit Wallet API Collection</a></p>
    
    <h2>API Endpoints</h2>
    
    <div class="endpoint">
        <p><span class="method">GET</span> /api/users/:id - Get user by ID</p>
        <p><strong>Example:</strong></p>
        <p class="code">curl -X GET https://orbitwallet.vercel.app/api/users/67d690cfc9363e7747ce7880</p>
    </div>
    
    <div class="endpoint">
        <p><span class="method">GET</span> /api/transactions/user/:userId - Get user transactions with filters</p>
        <p><strong>Example:</strong></p>
        <p class="code">curl -X GET "https://orbitwallet.vercel.app/api/transactions/user/67d690cfc9363e7747ce7880?status=success&type=credit&page=1&limit=10"</p>
    </div>
    
    <div class="endpoint">
        <p><span class="method">GET</span> /api/transactions - Get all transactions with pagination</p>
        <p><strong>Example:</strong></p>
        <p class="code">curl -X GET "https://orbitwallet.vercel.app/api/transactions?status=pending&type=debit&page=1&limit=10"</p>
    </div>
        <div class="endpoint">
        <p><span class="method">GET</span> /health - Health check endpoint</p>
        <p><strong>Example:</strong></p>
        <p class="code">curl -X GET https://orbitwallet.vercel.app/health</p>
    </div>
</body>
</html>

  `);
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use(errorHandler);

// Start server only in development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for serverless
export default app; 