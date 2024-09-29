import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../utils/dbConnect';
import mongoose from 'mongoose';

// Define a schema-less Mongoose model for the users collection
const UserSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Connect to the MongoDB database using Mongoose
    await dbConnect();

    // Count the number of male and female users using the Mongoose model
    const maleCount = await User.countDocuments({ gender: 'male' });
    const femaleCount = await User.countDocuments({ gender: 'female' });

    // Respond with the count of male and female users
    res.status(200).json({ male: maleCount, female: femaleCount });
  } catch (error) {
    console.error('Error fetching gender stats:', error);
    res.status(500).json({ error: 'Error fetching gender stats' });
  }
}
