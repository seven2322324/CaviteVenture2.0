import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../utils/dbConnect';
import User from '../../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect(); // Ensure the MongoDB connection is established

  if (req.method === 'GET') {
    try {
      // Fetch all users
      const users = await User.find({});
      res.status(200).json(users);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching users:', error.message);
        res.status(500).json({ message: 'Failed to fetch users', details: error.message });
      } else {
        console.error('Unknown error fetching users:', error);
        res.status(500).json({ message: 'Failed to fetch users due to unknown error' });
      }
    }
  } 
  else if (req.method === 'PUT') {
    const { userId, role } = req.body;

    // Validate that userId and role are provided
    if (!userId || !role) {
      return res.status(400).json({ message: 'User ID and role are required' });
    }

    try {
      // Update the user's role
      const user = await User.findByIdAndUpdate(
        userId, 
        { role }, 
        { new: true, runValidators: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Return the updated user data
      res.status(200).json(user);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error updating user role:', error.message);
        res.status(500).json({ message: 'Failed to update user role', details: error.message });
      } else {
        console.error('Unknown error updating user role:', error);
        res.status(500).json({ message: 'Failed to update user role due to unknown error' });
      }
    }
  } 
  else {
    // Handle unsupported methods
    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
