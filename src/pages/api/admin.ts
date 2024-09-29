import type { NextApiRequest, NextApiResponse } from 'next';
import { protectAdminRoutes } from '../../middlewares/authMiddleware';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Safely access the user object with proper typing
  res.status(200).json({ message: `Welcome Admin, ${req.user?.email}` });
}

export default protectAdminRoutes(handler);
