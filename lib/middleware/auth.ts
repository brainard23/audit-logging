import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { findUserById } from '../db/users';

export async function authenticateToken(req: NextRequest) {
  // Get the token from the Authorization header
  const authHeader = req.headers.get('authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return { user: null, error: 'No token provided' };
  }

  try {
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, secret) as { id: number; email: string };
    
    // Verify the user exists
    const user = await findUserById(decoded.id);
    if (!user) {
      return { user: null, error: 'User not found' };
    }

    return { user, error: null };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return { user: null, error: 'Token expired' };
    }
    return { user: null, error: 'Invalid token' };
  }
}

export async function authMiddleware(handler: Function) {
  return async (req: NextRequest) => {
    const { user, error } = await authenticateToken(req);
    
    if (error || !user) {
      return NextResponse.json(
        { error: error || 'Unauthorized' },
        { status: 401 }
      );
    }

    // Add user to the request object
    (req as any).user = user;
    
    return handler(req);
  };
}
