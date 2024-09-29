// pages/api/superadmin.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { protectSuperAdminRoutes } from '../../middlewares/authMiddleware';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Logic for superadmin route
  res.status(200).json({ message: 'Welcome, superadmin!' });
}

export default protectSuperAdminRoutes(handler);
