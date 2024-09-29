import { NextApiRequest, NextApiResponse } from 'next';
import { protect } from '../../middlewares/authMiddleware';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ message: `Welcome to your dashboard, ${req.user?.email}!` });
}

export default protect(handler);
