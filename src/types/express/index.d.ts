import { JwtPayload } from 'jsonwebtoken';

// Extend the Express Request interface
declare global {
  namespace Express {
    interface Request {
      // Define what your user object looks like.
      // Adjust these properties based on what your auth middleware actually attaches!
      user?: {
        id: string;
        role: string;
        [key: string]: any;
      };
    }
  }
}