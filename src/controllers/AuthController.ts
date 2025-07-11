import { NextFunction, Request, Response } from 'express';

import { RegisterUserRequest } from '../types';
import { UserService } from '../services/UserService';
import { Logger } from 'winston'; // Update the path as needed

export class AuthController {
  constructor(private userService: UserService, private logger: Logger) {}

  async register(req: RegisterUserRequest, res: Response, next: NextFunction) {
    const { firstName, lastName, email, password } = req.body;

    let user;
    try {
      user = await this.userService.create({
        firstName,
        lastName,
        email,
        password,
      });

      this.logger.info('User has been registerd', { id: user?.id });

      res.status(201).json({ user });
    } catch (err) {
      next(err);
      return;
    }
  }
}
