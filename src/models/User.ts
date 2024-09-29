import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// Define the interface for the User model
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId; // Ensure _id is typed correctly as ObjectId
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthday: Date;
  location: string;
  gender: string;
  isVerified: boolean;
  role: string;
  verificationCode?: string;
  verificationCodeExpires?: Date;
  comparePassword(enteredPassword: string): Promise<boolean>; // Instance method for password comparison
}

// Define the user schema
const userSchema: Schema<IUser> = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    birthday: { type: Date, required: true },
    location: { type: String, required: true },
    gender: { type: String, required: true },
    isVerified: { type: Boolean, default: false }, // Indicates if the user has been verified
    role: { type: String, enum: ['user', 'admin', 'superadmin'], default: 'user' }, // User roles
    verificationCode: { type: String }, // OTP verification code for email verification
    verificationCodeExpires: { type: Date }, // Expiration time for OTP
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Pre-save middleware: Hash the password before saving the user if it's new or modified
userSchema.pre('save', async function (next) {
  const user = this as IUser;

  // Only hash the password if it's new or modified
  if (!user.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds
    user.password = await bcrypt.hash(user.password, salt); // Hash the password using bcrypt
    return next();
  } catch (error) {
    return next(error as Error); // Handle errors gracefully
  }
});

// Instance method to compare the entered password with the stored hash during login
userSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
  const user = this as IUser;
  return bcrypt.compare(enteredPassword, user.password); // Compare entered password with hashed password
};

// Create or reuse the User model
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
