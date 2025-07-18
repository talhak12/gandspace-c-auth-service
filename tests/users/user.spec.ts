import request from 'supertest';
import app from '../../src/app';
import { DataSource } from 'typeorm';
import createJWKSMock from 'mock-jwks';
import { AppDataSource } from '../../src/config/data-source';
import { User } from '../../src/entity/User';
import { Roles } from '../../src/constants';

describe('GET /auth/self', () => {
  let connection: DataSource;
  let jwks: ReturnType<typeof createJWKSMock>;

  beforeAll(async () => {
    jwks = createJWKSMock('http://localhost:5501');
    // Replace with your actual DataSource initialization logic
    connection = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    jwks.start();
    // Replace with your actual DataSource initialization logic
    await connection.dropDatabase();
    await connection.synchronize();
  });

  afterAll(async () => {
    // Replace with your actual DataSource initialization logic
    connection.destroy();
  });

  afterEach(async () => {
    // Replace with your actual DataSource initialization logic
    jwks.stop();
  });

  describe('Given all fields', () => {
    it('should return the user data', async () => {
      //arrange
      const userData = {
        firstName: 'z',
        lastName: 'z',
        email: 'a@a.com',
        password: 'z',
      };
      const userRepository = connection.getRepository(User);
      const data = await userRepository.save({
        ...userData,
        role: Roles.Customer,
      });

      const accessToken = jwks.token({
        sub: String(data.id),
        role: data.role,
      });

      const response = await request(app)
        .get('/auth/self')
        .set('Cookie', [`accessToken=${accessToken}`])
        .send();

      expect(response.body.id).toBe(data.id);
    });
  });
});
