import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import dbConnect from '../../utils/dbConnect';
import mongoose from 'mongoose';

// Define a schema for the users collection
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  gender: { type: String, default: 'not specified' },
  location: { type: String, default: 'unknown' },
  birthday: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password, role } = req.body;

    if (!email || !password || role !== 'admin') {
      return res.status(400).json({ message: 'Invalid data provided' });
    }

    try {
      // Connect to the MongoDB database
      await dbConnect();

      // Check if the email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Admin with this email already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new admin user with default values
      const newAdmin = new User({
        email,
        password: hashedPassword,
        role: 'admin',
        firstName: 'Admin',       // Provide default value
        lastName: 'User',         // Provide default value
        gender: 'not specified',  // Provide default value
        location: 'unknown',      // Provide default value
        birthday: new Date('1970-01-01'),  // Provide dummy date
      });

      // Save the new admin user in the database
      const savedAdmin = await newAdmin.save();

      res.status(201).json({ message: 'Admin created successfully', userId: savedAdmin._id });
    } catch (error) {
      console.error('Error creating admin:', error);
      res.status(500).json({ error: 'Error creating admin' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
