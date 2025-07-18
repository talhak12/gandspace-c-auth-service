import fs from 'fs';
import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { AuthRequest, RegisterUserRequest } from '../types';
import { UserService } from '../services/UserService';
import { Logger } from 'winston'; // Update the path as needed
import createHttpError from 'http-errors';
import { TokenService } from '../services/TokenService';
import { CredentialService } from '../services/CredentialService';
const { validationResult } = require('express-validator');

export class AuthController {
  constructor(
    private userService: UserService,
    private logger: Logger,
    private tokenService: TokenService
  ) {}

  async register(req: RegisterUserRequest, res: Response, next: NextFunction) {
    const result = validationResult(req);

    if (result.errors.length > 0) {
      return res.status(400).json({ errors: result.errors });
    }

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

      try {
        const payload: JwtPayload = {
          sub: user.id.toString(),
          role: user.role,
        };
        const accessToken = this.tokenService.generateAccessToken(payload);

        res.cookie('accessToken', accessToken, {
          domain: 'localhost',
          sameSite: 'strict',
          maxAge: 1000 * 60 * 60,
          httpOnly: true,
        });
        const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365;

        const newRefreshToken = await this.tokenService.persistRefreshToken(
          user
        );

        const refreshToken = this.tokenService.generateRefreshToken({
          ...payload,
          id: String(newRefreshToken.id),
        });

        res.cookie('refreshToken', refreshToken, {
          domain: 'localhost',
          sameSite: 'strict',
          maxAge: MS_IN_YEAR,
          httpOnly: true,
        });
      } catch (err) {
        const error = createHttpError(500, 'Error while reading private key');
        next(error);
      }

      res.status(201).json({ user });
    } catch (err) {
      next(err);
      return;
    }
  }

  async login(req: RegisterUserRequest, res: Response, next: NextFunction) {
    try {
      const result = validationResult(req);

      if (result.errors.length > 0) {
        return res.status(400).json({ errors: result.array() });
      }
      const { email, password } = req.body;
      const user = await this.userService.findByEmail({ email });

      if (!user) {
        const error = createHttpError(400, 'Email or password does not match');
        next(error);
      } else {
        const g = new CredentialService();
        if (await g.comparePassword(password, user.password)) {
          console.log('c');
        }

        const payload: JwtPayload = {
          sub: user.id.toString(),
          role: user.role,
        };
        const accessToken = this.tokenService.generateAccessToken(payload);

        res.cookie('accessToken', accessToken, {
          domain: 'localhost',
          sameSite: 'strict',
          maxAge: 1000 * 60 * 60,
          httpOnly: true,
        });
        const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365;

        const newRefreshToken = await this.tokenService.persistRefreshToken(
          user
        );

        const refreshToken = this.tokenService.generateRefreshToken({
          ...payload,
          id: String(newRefreshToken.id),
        });

        res.cookie('refreshToken', refreshToken, {
          domain: 'localhost',
          sameSite: 'strict',
          maxAge: MS_IN_YEAR,
          httpOnly: true,
        });

        res.status(200).json({ user });
      }
    } catch (error) {
      next(error);
      return;
    }
  }

  async self(req: AuthRequest, res: Response) {
    console.log('dd', req.auth);
    res.json({ c: req.auth });
  }
}
