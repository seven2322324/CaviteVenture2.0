import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export function verifyToken(token: string): { valid: boolean; message: string; decoded?: JwtPayload | string } {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { valid: true, message: 'Token is valid', decoded };
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.name === 'TokenExpiredError') {
        console.error('Token has expired:', error.message);
        return { valid: false, message: 'Token has expired' };
      } else if (error.name === 'JsonWebTokenError') {
        console.error('Invalid token:', error.message);
        return { valid: false, message: 'Invalid token' };
      } else {
        console.error('Token verification failed:', error.message);
        return { valid: false, message: 'Token verification failed' };
      }
    }

    // Return a fallback error message if error is not an instance of Error
    return { valid: false, message: 'Unknown error occurred during token verification' };
  }
}
