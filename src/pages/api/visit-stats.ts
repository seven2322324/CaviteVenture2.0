import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../utils/dbConnect';
import mongoose from 'mongoose';

// Schema-less Mongoose model for the 'visits' collection
const VisitSchema = new mongoose.Schema({}, { strict: false });
const Visit = mongoose.models.Visit || mongoose.model('Visit', VisitSchema);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Connect to the MongoDB database using dbConnect
    await dbConnect();

    // Current date
    const currentDate = new Date();

    // Calculate daily visits for the last 30 days
    const last30Days = new Date();
    last30Days.setDate(currentDate.getDate() - 30);

    const dailyVisits = await Visit.aggregate([
      {
        $match: {
          date: { $gte: last30Days, $lte: currentDate }, // Filter visits within the last 30 days
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, // Group by date
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } }, // Sort by date
    ]);

    // Calculate monthly visits for the last 12 months
    const last12Months = new Date();
    last12Months.setMonth(currentDate.getMonth() - 11);

    const monthlyVisits = await Visit.aggregate([
      {
        $match: {
          date: { $gte: last12Months, $lte: currentDate }, // Filter visits within the last 12 months
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$date" } }, // Group by year and month
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } }, // Sort by year and month
    ]);

    // Log the result to verify
    console.log('Daily Visits:', dailyVisits);
    console.log('Monthly Visits:', monthlyVisits);

    // Return daily and monthly visit stats
    res.status(200).json({
      dailyVisits: dailyVisits.map((v) => ({ date: v._id, count: v.count })),
      monthlyVisits: monthlyVisits.map((v) => ({ month: v._id, count: v.count })),
    });
  } catch (error) {
    // Assert the type of error as Error to access the message property
    if (error instanceof Error) {
      console.error('Error fetching visit stats:', error.message);
      res.status(500).json({ error: 'Error fetching visit stats', details: error.message });
    } else {
      // Handle non-Error types of errors if any (e.g., unexpected exceptions)
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
}
