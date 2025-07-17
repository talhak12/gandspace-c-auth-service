import fs from 'fs';

import { NextFunction, Request, Response } from 'express';
import { sign, JwtPayload } from 'jsonwebtoken';
import { RegisterUserRequest } from '../types';
import { UserService } from '../services/UserService';
import { error, Logger } from 'winston'; // Update the path as needed
import createHttpError from 'http-errors';
import { Roles } from '../constants';
import path from 'path';
import { Config } from '../config';
import { AppDataSource } from '../config/data-source';
import { RefreshToken } from '../entity/RefreshToken';
import { TokenService } from '../services/TokenService';
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

        const refreshTokenRepository =
          AppDataSource.getRepository(RefreshToken);

        const newRefreshToken = await refreshTokenRepository.save({
          user: user,
          expiresAt: new Date(Date.now() + MS_IN_YEAR),
        });

        /* const refreshToken = sign(
          payload,
          Config.REFRESH_TOKEN_SECRET as string,
          {
            algorithm: 'HS256',
            expiresIn: '1y',
            jwtid: String(newRefreshToken.id),
          }
        );*/
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
}
