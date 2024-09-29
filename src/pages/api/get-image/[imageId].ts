import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const { imageId } = req.query;

  if (!mongoose.Types.ObjectId.isValid(imageId as string)) {
    return res.status(400).json({ message: 'Invalid image ID' });
  }

  try {
    const db = mongoose.connection.db;

    // Check if the db is available
    if (!db) {
      return res.status(500).json({ message: 'Database connection not established' });
    }

    const bucket = new GridFSBucket(db, { bucketName: 'images' });

    const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(imageId as string));

    downloadStream.on('data', (chunk) => {
      res.write(chunk);
    });

    downloadStream.on('error', () => {
      res.status(404).json({ message: 'Image not found' });
    });

    downloadStream.on('end', () => {
      res.end();
    });
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).json({ message: 'Failed to fetch image' });
  }
}
