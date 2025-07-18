import { JwtPayload, sign } from 'jsonwebtoken';
import fs, { ReadPosition } from 'fs';
import path from 'path';
import createHttpError from 'http-errors';
import { Config } from '../config';
import { User } from '../entity/User';
import { AppDataSource } from '../config/data-source';
import { RefreshToken } from '../entity/RefreshToken';
import { Repository } from 'typeorm';

export class TokenService {
  constructor(private u: Repository<RefreshToken>) {}
  generateAccessToken(payload: JwtPayload) {
    let privateKey: Buffer;
    try {
      privateKey = fs.readFileSync(
        path.join(__dirname, '../../certs/private.pem')
      );
    } catch (err) {
      const error = createHttpError(500, 'Error while reading private key');
      throw error;
    }

    const accessToken = sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '1m',
      issuer: 'auth-service',
    });
    return accessToken;
  }

  generateRefreshToken(payload: JwtPayload) {
    const refreshToken = sign(payload, Config.REFRESH_TOKEN_SECRET as string, {
      algorithm: 'HS256',
      expiresIn: '1y',
      jwtid: String(payload.id),
    });

    return refreshToken;
  }

  async persistRefreshToken(user: User) {
    const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365;

    return await this.u.save({
      user: user,
      expiresAt: new Date(Date.now() + MS_IN_YEAR),
    });
  }

  async deleteRefreshToken(id: number) {
    return await this.u.delete({
      id: id,
    });
  }
}
