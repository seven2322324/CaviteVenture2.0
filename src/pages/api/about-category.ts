import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../utils/dbConnect'; // Assuming you're using Mongoose
import Category from '../../models/Category'; // Assuming you have a Category model defined

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Disable caching
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  // Connect to the database
  await dbConnect();

  // Handle the request based on the HTTP method
  switch (req.method) {
    case 'GET':
      return handleGetCategories(req, res);
    case 'POST':
      return handlePostCategories(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}

// Function to handle GET requests (fetching categories)
async function handleGetCategories(req: NextApiRequest, res: NextApiResponse) {
  try {
    const categories = await Category.find({}); // Fetch all categories
    return res.status(200).json({ categories });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching categories:', error.message);
      return res.status(500).json({ message: 'Failed to fetch categories', error: error.message });
    } else {
      console.error('Unknown error fetching categories:', error);
      return res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
}

// Function to handle POST requests (updating categories)
async function handlePostCategories(req: NextApiRequest, res: NextApiResponse) {
  const { categories } = req.body;

  // Validate the incoming category data
  if (!categories || !Array.isArray(categories)) {
    return res.status(400).json({ message: 'Invalid category data: Must be an array of categories' });
  }

  try {
    // Clear the current categories collection
    await Category.deleteMany({}); // This will remove all previous entries

    // Insert the new categories into the collection
    const insertResult = await Category.insertMany(categories);

    // Check if the insert was successful
    if (insertResult) {
      return res.status(200).json({
        message: 'Category data updated successfully',
        categories: insertResult,
      });
    } else {
      return res.status(500).json({ message: 'Failed to update category data' });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error updating categories:', error.message);
      return res.status(500).json({ message: 'Failed to update category data', error: error.message });
    } else {
      console.error('Unknown error updating categories:', error);
      return res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
}
