import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Invalidate the token on the client-side by removing it from storage
  // For example, you can handle this on the frontend by clearing the token from cookies/localStorage
  res.status(200).json({ message: 'Logged out successfully' });
}
