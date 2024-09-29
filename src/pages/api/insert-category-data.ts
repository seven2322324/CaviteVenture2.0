import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../utils/dbConnect';
import Category from '../../models/Category';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  try {
    // Connect to MongoDB
    await dbConnect();

    // Prepare the category data to insert
    const categoryData = [
      { question: 'Zapote Bridge', answer: 'Battle of Zapote Bridge (1897)...' },
      { question: 'Battle of Binakayan', answer: 'Battle of Binakayan (1896)...' },
      { question: 'Casa De Tajeros', answer: 'Tejeros Convention (1897)...' },
      { question: 'San Roque Church', answer: 'Historical landmark in Cavite...' },
    ];

    // Check if the data already exists to prevent duplicate entries
    const existingCategories = await Category.find({
      question: { $in: categoryData.map(c => c.question) },
    });

    if (existingCategories.length > 0) {
      return res.status(400).json({ message: 'Some categories already exist in the database' });
    }

    // Insert the data into the 'categories' collection using the Category model
    await Category.insertMany(categoryData);

    // Return a success response
    return res.status(200).json({ message: 'Category data inserted successfully' });
  } catch (error) {
    console.error('Error inserting category data:', error);
    return res.status(500).json({ message: 'Failed to insert category data' });
  }
}
