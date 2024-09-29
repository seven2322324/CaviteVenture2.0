import { NextApiRequest, NextApiResponse } from 'next';
import User from '../../../models/User';
import dbConnect from '../../../utils/dbConnect';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const { otp } = req.body;

  if (!otp) {
    return res.status(400).json({ message: 'Missing OTP' });
  }

  try {
    // Find user by OTP
    const user = await User.findOne({ verificationCode: otp });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if OTP is still valid
    if (!user.verificationCodeExpires || Date.now() > user.verificationCodeExpires.getTime()) {
      return res.status(401).json({ message: 'Invalid or expired OTP' });
    }

    // Mark user as verified and clear OTP
    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    return res.status(200).json({ message: 'Email successfully verified' });
  } catch (error: unknown) {
    const err = error as Error; // Explicitly type the error
    console.error('Error during OTP verification:', err.message);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
}
