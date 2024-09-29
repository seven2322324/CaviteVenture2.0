import type { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import fs from 'fs'; // Import the file system module
import dbConnect from '../../../utils/dbConnect'; // Your DB connection utility
import Image from '../../../models/Image'; // Your Image model

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid ID parameter' });
    }

    try {
      await dbConnect(); // Ensure database connection

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid ObjectId format' });
      }

      const imageRecord = await Image.findById(id);
      if (!imageRecord) {
        return res.status(404).json({ error: 'Image not found' });
      }

      // Remove the file from the file system
      const filePath = `./public${imageRecord.imageUrl}`;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Remove the record from MongoDB
      await Image.deleteOne({ _id: id });

      return res.status(200).json({ message: 'Image deleted successfully' });
    } catch (error) {
      console.error('Error deleting image:', error);
      return res.status(500).json({ error: 'Failed to delete image' });
    }
  } else {
    // Return 405 Method Not Allowed for unsupported HTTP methods
    res.setHeader('Allow', ['DELETE']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
