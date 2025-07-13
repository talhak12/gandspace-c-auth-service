import registerValidator from '../validators/register-validator';

import express, { NextFunction } from 'express';
import { Request, Response } from 'express';
import { AuthController } from '../controllers/AuthController';
import { UserService } from '../services/UserService';
import { AppDataSource } from '../config/data-source';
import { User } from '../entity/User';
import logger from '../config/logger';
//const { body } = require('express-validator');

const { check, query, validationResult } = require('express-validator');

const router = express.Router();
const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);

const authController = new AuthController(userService, logger);

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

export default router;
