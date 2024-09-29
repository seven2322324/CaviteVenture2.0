import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../utils/dbConnect';
import mongoose from 'mongoose';

// Define a schema-less Mongoose model for the events collection
const EventSchema = new mongoose.Schema({}, { strict: false });
const Event = mongoose.models.Event || mongoose.model('Event', EventSchema);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Connect to the MongoDB database using Mongoose
    await dbConnect();

    // Check for the 'popular' query parameter and adjust the query accordingly
    const isPopular = req.query.popular === 'true';
    const query = isPopular ? { isPopular: true } : {}; // Fetch all events if no filter is applied

    // Fetch events from the 'events' collection
    const events = await Event.find(query).lean(); // Use lean() for better performance when reading data

    // Log fetched events to debug if empty
    console.log('Fetched events:', events);

    // If no events are found, return 404
    if (events.length === 0) {
      return res.status(404).json({ message: 'No events found' });
    }

    // Return the events in the response
    res.status(200).json(events);
  } catch (error) {
    console.error('Failed to fetch events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
}
