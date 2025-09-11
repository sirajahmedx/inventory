import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  status: 'active' | 'inactive' | 'discontinued';
  categoryId: mongoose.Types.ObjectId;
  supplierId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt?: Date;
  // Populated fields (not stored in DB)
  category?: string;
  supplier?: string;
}

const ProductSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    uppercase: true,
    trim: true,
    maxlength: [50, 'SKU cannot exceed 50 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative'],
    default: 0
  },
  status: {
    type: String,
    enum: ['Available', 'Stock Out', 'Stock Low', 'active', 'inactive', 'discontinued'],
    default: 'Available',
    required: true
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category ID is required']
  },
  supplierId: {
    type: Schema.Types.ObjectId,
    ref: 'Supplier',
    required: [true, 'Supplier ID is required']
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  }
}, {
  timestamps: true,
  collection: 'products'
});

// Index for better query performance (SKU is already indexed by unique)
ProductSchema.index({ categoryId: 1 });
ProductSchema.index({ supplierId: 1 });
ProductSchema.index({ status: 1 });
ProductSchema.index({ userId: 1, categoryId: 1 });
ProductSchema.index({ userId: 1, supplierId: 1 });

// Pre-save middleware to ensure SKU is uppercase
ProductSchema.pre('save', function(next) {
  if (this.sku ) {
    this.sku = this?.sku.toUpperCase();
  }
  next();
});

export default mongoose?.models?.Product || mongoose?.model<IProduct>('Product', ProductSchema);
