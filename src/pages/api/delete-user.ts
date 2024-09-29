import { NextApiRequest, NextApiResponse } from 'next';
import { Types } from 'mongoose'; // Import Mongoose's ObjectId (Types.ObjectId)
import dbConnect from '../../utils/dbConnect';
import mongoose from 'mongoose';

// Define a schema-less model for the users collection
const UserSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const { userId } = req.query;

    if (!userId || !Types.ObjectId.isValid(userId as string)) {
      return res.status(400).json({ error: 'A valid User ID is required' });
    }

    try {
      // Connect to MongoDB using dbConnect
      await dbConnect();

      // Delete the user using the Mongoose model
      const result = await User.deleteOne({ _id: new Types.ObjectId(userId as string) });

      if (result.deletedCount === 1) {
        res.status(200).json({ message: 'User deleted successfully' });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Failed to delete user' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
