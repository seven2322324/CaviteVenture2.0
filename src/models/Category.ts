// models/Category.ts
import mongoose, { Schema, Document } from 'mongoose';

interface ICategory extends Document {
  question: string;
  answer: string;
}

const CategorySchema: Schema = new Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
