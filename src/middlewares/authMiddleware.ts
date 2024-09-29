import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import dbConnect from '../utils/dbConnect';

// Define the interface for the user payload in JWT
interface JwtPayloadWithId extends JwtPayload {
  id: string;
  role: string;
}

// Extend NextApiRequest to include a user property with the IUser type
declare module 'next' {
  interface NextApiRequest {
    user?: {
      id: string;
      role: string;
      email: string;
    };
  }
}

// Middleware to handle JWT authentication and role-based access
export const protect = (
  handler: NextApiHandler,
  allowedRoles: string[] = [] // Allow for optional role-based protection
) => async (req: NextApiRequest, res: NextApiResponse) => {
  let token: string | undefined;

  // Check if the token is present in the Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]; // Extract token from 'Bearer <token>'
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, token not provided' });
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayloadWithId;

    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: 'Not authorized, invalid token payload' });
    }

    // Connect to the MongoDB database
    await dbConnect();

    // Find the user from the decoded JWT token and exclude the password field
    const user = await User.findById(decoded.id).select('-password') as IUser;
    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    // Attach the user details to the request object for further use
    req.user = {
      id: user._id.toString(),
      role: user.role,
      email: user.email,
    };

    // Role-based access control: Ensure the user has an allowed role if roles are specified
    if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: insufficient permissions' });
    }

    // Proceed to the next handler if everything is valid
    return handler(req, res);
  } catch (error: unknown) {
    // Check the error's name for token expiration or invalid token
    if (error instanceof Error && error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired, please log in again' });
    }

    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Not authorized, token verification failed' });
    }

    // Handle any other unexpected errors
    console.error('Unexpected token verification error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Protect routes for admin and superadmin
export const protectAdminRoutes = (handler: NextApiHandler) => protect(handler, ['admin', 'superadmin']);

// Protect routes exclusively for superadmin
export const protectSuperAdminRoutes = (handler: NextApiHandler) => protect(handler, ['superadmin']);

// Protect routes for general users (no role-based protection)
export const protectUserRoutes = (handler: NextApiHandler) => protect(handler);
