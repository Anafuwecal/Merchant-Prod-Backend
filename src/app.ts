import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import { globalErrorHandler } from './middlewares/errorHandler';
import variantRoutes from './routes/variant.routes';
import orderRoutes from './routes/order.routes';
import dashboardRoutes from './routes/dashboard.routes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Base Route Test
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'Server is performing smoothly' });
});

/// Main Routes
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/variants', variantRoutes);
app.use('/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Global Error Middleware
app.use(globalErrorHandler);

// Database Connection
const PORT = process.env.PORT || 7000;
const MONGO_URI = process.env.MONGO_URI || '*';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(' Connected to MongoDB securely.');
    app.listen(PORT, () => console.log(` Server running dynamically on port ${PORT}`));
  })
  .catch((err) => console.error('Database connection error:', err));

export default app;