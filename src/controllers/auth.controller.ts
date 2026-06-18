import type{ Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const merchant = await AuthService.register(req.body);
      res.status(201).json({
        status: 'success',
        data: { merchant },
      });
    } catch (error) {
      // Safeguard: If next is missing or undefined, send the response directly
      if (typeof next === 'function') {
        next(error);
      } else {
        res.status(500).json({
          status: 'error',
          message: error instanceof Error ? error.message : 'Registration failed',
        });
      }
    }
  }

  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.login(req.body);
      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      if (typeof next === 'function') {
        next(error);
      } else {
        res.status(401).json({
          status: 'error',
          message: error instanceof Error ? error.message : 'Login failed',
        });
      }
    }
  }
}