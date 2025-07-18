import registerValidator from '../validators/register-validator';

import express, { NextFunction } from 'express';
import { Request, Response } from 'express';
import { AuthController } from '../controllers/AuthController';
import { UserService } from '../services/UserService';
import { AppDataSource } from '../config/data-source';
import { User } from '../entity/User';
import logger from '../config/logger';
import { TokenService } from '../services/TokenService';
import { RefreshToken } from '../entity/RefreshToken';
import loginValidator from '../validators/login-validator';
import authenticate from '../middlewares/authenticate';
import { AuthRequest } from '../types';
import validateRefreshToken from '../middlewares/validateRefreshToken';

//const { body } = require('express-validator');

const { check, query, validationResult } = require('express-validator');

const router = express.Router();
const userRepository = AppDataSource.getRepository(User);
const refreshRepository = AppDataSource.getRepository(RefreshToken);
const userService = new UserService(userRepository);

const tokenService = new TokenService(refreshRepository);
const authController = new AuthController(userService, logger, tokenService);

router.post(
  '/register',
  registerValidator,

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await authController.register(req, res, next);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/login',
  loginValidator,

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await authController.login(req, res, next);
    } catch (err) {
      next(err);
    }
  }
);

router.get('/self', authenticate, async (req: Request, res: Response) => {
  try {
    await authController.self(req as AuthRequest, res);
  } catch (err) {
    //next(err);
  }
});

router.post(
  '/refresh',
  validateRefreshToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await authController.refresh(req as AuthRequest, res, next);
    } catch (err) {
      //next(err);
    }
  }
);

export default router;
