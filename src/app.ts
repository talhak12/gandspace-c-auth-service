import express, { Request, Response, NextFunction } from 'express';
import logger from './config/logger';
import { HttpError } from 'http-errors';

const app = express();

app.get('/', (req, res, next) => {
  //const err = createHttpError(401, 'You cannot access this route');
  res.send('welcome to auth service');
});

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  logger.info(err.message);
  // You can customize statusCode extraction if you have custom error types
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    errors: [
      {
        type: err.name,
        msg: err.message,
        path: '',
        location: '',
      },
    ],
  });
});

export default app;
