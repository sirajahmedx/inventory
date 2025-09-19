import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt?: Date;
}

const CategorySchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    maxlength: [100, 'Category name cannot exceed 100 characters']
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  }
}, {
  timestamps: true,
  collection: 'categories'
});

CategorySchema.index({ userId: 1 });
CategorySchema.index({ name: 1, userId: 1 });

export default mongoose?.models?.Category || mongoose?.model<ICategory>('Category', CategorySchema);
