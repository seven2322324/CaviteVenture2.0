import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import User from '../../../models/User';
import sendEmail from '../../../utils/sendEmail';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { firstName, lastName, email, password, birthday, location, gender } = req.body;

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Ensure database is connected
    await dbConnect();

    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    console.log('Received signup data:', { firstName, lastName, email, birthday, location, gender });

    // Ensure email is valid before proceeding
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    // Create the user with the default role as 'user'
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      birthday: new Date(birthday),
      location,
      gender,
      role: 'user', // Set default role as 'user'
      verificationCode: otp,
      verificationCodeExpires: otpExpires,
    });

    // Send the OTP email
    await sendEmail({
      email: user.email,
      subject: 'Your Verification Code',
      message: `Your OTP verification code is: ${otp}. It will expire in 10 minutes.`,
    });

    res.status(201).json({ message: 'User registered. Check your email for the OTP to verify your account.' });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error during signup:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}
