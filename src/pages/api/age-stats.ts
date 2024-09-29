import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../utils/dbConnect';
import mongoose from 'mongoose';

// Define a schema-less model for the 'users' collection
const UserSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Connect to the MongoDB database using dbConnect
    await dbConnect();

    // Fetch all users, projecting only the birthday field
    const users = await User.find({}, { birthday: 1 }).lean(); // Use lean() for better performance when reading data
    const currentYear = new Date().getFullYear();

    // Calculate age groups
    const ageGroups: { [key: string]: number } = {
      '18-25': 0,
      '26-35': 0,
      '36-45': 0,
      '46-60': 0,
      '60+': 0,
    };

    users.forEach(user => {
      const birthYear = new Date(user.birthday).getFullYear();
      const age = currentYear - birthYear;

      if (age >= 18 && age <= 25) ageGroups['18-25']++;
      else if (age >= 26 && age <= 35) ageGroups['26-35']++;
      else if (age >= 36 && age <= 45) ageGroups['36-45']++;
      else if (age >= 46 && age <= 60) ageGroups['46-60']++;
      else if (age > 60) ageGroups['60+']++;
    });

    // Return the calculated age groups as JSON response
    res.status(200).json({ ageGroups });
  } catch (error) {
    console.error('Error fetching age stats:', error);
    res.status(500).json({ error: 'Error fetching age stats' });
  }
}
