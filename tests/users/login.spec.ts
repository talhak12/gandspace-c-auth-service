import request from 'supertest';
import app from '../../src/app';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import { isJwt, truncateTables } from './utils';
import { User } from '../../src/entity/User';
import { Roles } from '../../src/constants';
import { RefreshToken } from '../../src/entity/RefreshToken';

describe('POST /auth/login', () => {
  let connection: DataSource;

  beforeAll(async () => {
    // Replace with your actual DataSource initialization logic
    connection = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    // Replace with your actual DataSource initialization logic
    await connection.dropDatabase();
    await connection.synchronize();
  });

  afterAll(async () => {
    // Replace with your actual DataSource initialization logic
    connection.destroy();
  });

  describe('Given all fields', () => {
    it('should return the 201 status code', async () => {
      //arrange
      const userData = {
        email: 'a@a.com',
        password: 'z',
      };
      //act
      const response = await request(app).post('/auth/login').send(userData);
      //assert
      expect(response.statusCode).toBe(201);
    });
  });
});
