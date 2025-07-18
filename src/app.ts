import express, { Request, Response, NextFunction, json } from 'express';
import cookieParser from 'cookie-parser';
import logger from './config/logger';
import { HttpError } from 'http-errors';
import authRouter from './routes/auth';

const app = express();

app.use(express.static('public'));

app.use(cookieParser());
app.use(express.json());

app.get('/', (req, res, next) => {
  //const err = createHttpError(401, 'You cannot access this route');
  res.send('welcome to auth service');
});

app.use('/auth', authRouter);

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  console.log(err);

  logger.info(err.message);
  // You can customize statusCode extraction if you have custom error types
  const statusCode = err.statusCode || err.status || 500;

  //res.setHeader('Content-Type', 'application/json');

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
