import mongoose from 'mongoose';

// Import all models
import User from './User';
import Category from './Category';
import Supplier from './Supplier';
import Product from './Product';

// Database connection
const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/inventory';

if (!MONGODB_URI) {
  throw new Error('Please define the DATABASE_URL environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ Connected to MongoDB with Mongoose');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Export models and connection function
export {
  connectToDatabase,
  User,
  Category,
  Supplier,
  Product
};

// Export types
export type { IUser } from './User';
export type { ICategory } from './Category';
export type { ISupplier } from './Supplier';
export type { IProduct } from './Product';
