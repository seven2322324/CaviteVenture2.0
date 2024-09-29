import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

// Initialize MongoDB connection
const connectMongo = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI as string);
};

// User Schema
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  birthday: { type: Date, required: true },
  gender: { type: String, required: true },
  role: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

// Check if the User model already exists (to prevent overwriting it during hot-reloads)
const User = mongoose.models.User || mongoose.model('User', userSchema);

// JWT Secret (ensure this matches the one used for generating tokens during login)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Types
interface User {
  firstName: string;
  lastName: string;
  birthday: Date;
  gender: string;
  role: string;
  email: string;
}

// API handler for fetching and updating user profile
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectMongo();

  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        // Extract the Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader) {
          return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        const token = authHeader.split(' ')[1]; // Extract the token from the "Bearer <token>" format
        if (!token) {
          return res.status(401).json({ message: 'Unauthorized: Invalid token format' });
        }

        // Verify the token and extract the user ID
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

        // Fetch the user based on the extracted ID
        const user = await User.findById(decoded.id);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        // Return the user's profile data
        res.status(200).json({
          firstName: user.firstName,
          lastName: user.lastName,
          birthday: user.birthday,
          gender: user.gender,
          role: user.role,
          email: user.email,
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Error fetching user data', error });
      }
      break;

    case 'PUT':
      try {
        // Extract the Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader) {
          return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
          return res.status(401).json({ message: 'Unauthorized: Invalid token format' });
        }

        // Verify the token and extract the user ID
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

        // Fetch and update user data based on the extracted user ID
        const { firstName, lastName, birthday, gender, email } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
          decoded.id,
          { $set: { firstName, lastName, birthday, gender, email } },
          { new: true, runValidators: true }
        );

        if (!updatedUser) {
          return res.status(404).json({ message: 'User not found' });
        }

        // Return the updated user profile data
        res.status(200).json(updatedUser);
      } catch (error) {
        console.error('Error updating user data:', error);
        res.status(500).json({ message: 'Error updating user data', error });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
