import mongoose, { Document, Schema } from 'mongoose';

export interface ISupplier extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  userId: mongoose.Types.ObjectId;
  email?: string;
  phone?: string;
  createdAt: Date;
  updatedAt?: Date;
}

const SupplierSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Supplier name is required'],
    trim: true,
    maxlength: [100, 'Supplier name cannot exceed 100 characters']
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    trim: true,
    maxlength: [20, 'Phone number cannot exceed 20 characters']
  }
}, {
  timestamps: true,
  collection: 'suppliers'
});

// Index for better query performance
SupplierSchema.index({ userId: 1 });
SupplierSchema.index({ name: 1, userId: 1 }); // Compound index for unique supplier names per user

export default mongoose?.models?.Supplier || mongoose?.model<ISupplier>('Supplier', SupplierSchema);
