import { expressjwt } from 'express-jwt';
import { Config } from '../config';
import { Request } from 'express';
import { AppDataSource } from '../config/data-source';
import { RefreshToken } from '../entity/RefreshToken';
import { Jwt } from 'jsonwebtoken';
import logger from '../config/logger';
import { IRefreshTokenPayload } from '../types';

export default expressjwt({
  secret: Config.REFRESH_TOKEN_SECRET!,
  algorithms: ['HS256'],
  getToken(req: Request) {
    type RefreshCookie = {
      refreshToken: string;
    };

    const { refreshToken } = req.cookies as RefreshCookie;
    return refreshToken;
  },
  async isRevoked(request: Request, token) {
    try {
      const refreshTokenRepo = AppDataSource.getRepository(RefreshToken);
      const refreshToken = await refreshTokenRepo.findOne({
        where: {
          id: Number((token?.payload as IRefreshTokenPayload).id),
          user: { id: Number(token?.payload.sub) },
        },
      });
      logger.info(refreshToken);
      console.log('ref', refreshToken);
      return refreshToken === null;
    } catch (err) {
      logger.error('Error while getting refresh token');
    }
    return true;
  },
});
