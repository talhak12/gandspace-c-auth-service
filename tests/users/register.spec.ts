import request from 'supertest';
import app from '../../src/app';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import { truncateTables } from './utils';
import { User } from '../../src/entity/User';

describe('POST /auth/register', () => {
  let connection: DataSource;

  beforeAll(async () => {
    // Replace with your actual DataSource initialization logic
    connection = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    // Replace with your actual DataSource initialization logic
    await truncateTables(connection);
  });

  afterAll(async () => {
    // Replace with your actual DataSource initialization logic
    connection.destroy();
  });

  describe('Given all fields', () => {
    it('should return the 201 status code', async () => {
      //arrange
      const userData = {
        firstName: 'z',
        lastName: 'z',
        email: 'z',
        password: 'z',
      };
      //act
      const response = await request(app).post('/auth/register').send(userData);
      //assert
      expect(response.statusCode).toBe(201);
    });

    it('should return valid json response', async () => {
      //arrange
      const userData = {
        firstName: 'z',
        lastName: 'z',
        email: 'z',
        password: 'z',
      };
      //act
      const response = await request(app).post('/auth/register').send(userData);
      //assert
      expect(response.headers['content-type']).toEqual(
        expect.stringContaining('json')
      );
    });

    it('should persist the user in the database', async () => {
      //arrange
      const userData = {
        firstName: 'z',
        lastName: 'z',
        email: 'z',
        password: 'z',
      };
      //act
      await request(app).post('/auth/register').send(userData);

      //assert
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users).toHaveLength(1);

      expect(users[0].firstName).toBe(userData.firstName);
      expect(users[0].lastName).toBe(userData.lastName);
      expect(users[0].email).toBe(userData.email);
    });
  });
  describe('Fields are missing', () => {});
});
