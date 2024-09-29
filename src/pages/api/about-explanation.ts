import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../utils/dbConnect';
import mongoose from 'mongoose';

// Schema for aboutData
const aboutDataSchema = new mongoose.Schema({
  title: String,
  description: String,
  images: [{ url: String, alt: String }], // Assume `url` is the ObjectId of the image stored in GridFS
}, { strict: false });

const AboutData = mongoose.models.AboutData || mongoose.model('AboutData', aboutDataSchema);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'GET') {
    // Handle GET request to fetch about data
    try {
      const aboutData = await AboutData.findOne({});

      if (!aboutData) {
        return res.status(404).json({ message: 'No about data found' });
      }

      return res.status(200).json(aboutData);
    } catch (error) {
      console.error('Error fetching about data:', error);
      return res.status(500).json({ message: 'Failed to fetch about data' });
    }
  }

  if (req.method === 'POST') {
    // Handle POST request to create or update about data
    try {
      const { title, description, images } = req.body;

      if (!title || !description || !Array.isArray(images)) {
        return res.status(400).json({ message: 'Missing or invalid required fields' });
      }

      // Insert or update the aboutData document with the client-provided data
      const updatedData = { title, description, images };
      const result = await AboutData.updateOne({}, { $set: updatedData }, { upsert: true });

      if (result.acknowledged) {
        return res.status(200).json({ message: 'About data updated successfully' });
      } else {
        return res.status(500).json({ message: 'Failed to update about data' });
      }
    } catch (error) {
      console.error('Error updating about data:', error);
      return res.status(500).json({ message: 'Failed to update about data' });
    }
  }

  // Return a 405 if any other method is used
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
}
