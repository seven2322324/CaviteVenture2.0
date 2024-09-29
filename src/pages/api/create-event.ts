import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../utils/dbConnect';
import Event from '../../models/Event';

// Disable default body parsing
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Set the maximum payload size (adjust as needed)
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect(); // Ensure the MongoDB connection is established

  if (req.method === 'POST') {
    const { title, location, date, imageUrl, description } = req.body;

    // Validate the input
    if (!title || !location || !date || !imageUrl || !description) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      // Create a new event document using the Mongoose model
      const newEvent = new Event({
        title,
        location,
        date,
        imageUrl, // Save the Cloudinary URL here
        description,
      });

      // Save the new event in the database
      const savedEvent = await newEvent.save();

      res.status(201).json(savedEvent);
    } catch (err) {
      console.error('Error creating event:', err);
      res.status(500).json({ error: 'Failed to create event' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
