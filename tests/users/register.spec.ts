import request from 'supertest';
import app from '../../src/app';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import { isJwt, truncateTables } from './utils';
import { User } from '../../src/entity/User';
import { Roles } from '../../src/constants';

describe('POST /auth/register', () => {
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
        firstName: 'z',
        lastName: 'z',
        email: 'a@a.com',
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
        email: 'a@a.com',
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
        email: 'a@a.com',
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

    it('should return user id', async () => {
      //arrange
      const userData = {
        firstName: 'z',
        lastName: 'z',
        email: 'a@a.com',
        password: 'z',
      };
      //act
      const response = await request(app).post('/auth/register').send(userData);

      //assert
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(response.body?.user?.id).toBeGreaterThan(0);
    });

    it('should assign a user with specific customer role', async () => {
      //arrange
      const userData = {
        firstName: 'z',
        lastName: 'z',
        email: 'a@a.com',
        password: 'z',
      };
      //act
      const response = await request(app).post('/auth/register').send(userData);

      //console.log(response.body.user);
      //assert

      expect(response.body.user).toHaveProperty('role');
      expect(response.body.user.role).toBe('customer');
    });

    it('should return 400 status code if email already exists', async () => {
      //arrange
      const userData = {
        firstName: 'z',
        lastName: 'z',
        email: 'a@a.com',
        password: 'z',
      };
      //act
      const userRepository = connection.getRepository(User);
      await userRepository.save({ ...userData, role: Roles.Customer });

      const response = await request(app).post('/auth/register').send(userData);

      expect(response.statusCode).toBe(400);
      //assert
      //console.log(response.body.user.password);
      //expect(response.body.user.password).not.toBe(userData.password);
    });

    it('should return the access token and refresh token inside a cookie', async () => {
      //arrange
      const userData = {
        firstName: 'z',
        lastName: 'z',
        email: 'a@a.com',
        password: 'z',
      };
      //act
      //const userRepository = connection.getRepository(User);
      //await userRepository.save({ ...userData, role: Roles.Customer });

      const response = await request(app).post('/auth/register').send(userData);

      let accessToken = '';
      let refreshToken = '';

      if (response.headers['set-cookie'].length > 0) {
        accessToken = response.headers['set-cookie'][0]
          .split('=')[1]
          .split(';')[0];
        refreshToken = response.headers['set-cookie'][1]
          .split('=')[1]
          .split(';')[0];
      }

      console.log('accessToken', accessToken);
      console.log('refreshToken', refreshToken);

      expect(accessToken).not.toBe('');
      expect(refreshToken).not.toBe('');

      expect(isJwt(accessToken)).toBeTruthy();
      expect(isJwt(refreshToken)).toBeTruthy();

      //const cookies = response.headers['set-cookie'] || [];
      /*console.log(
        response.headers['set-cookie'][0].split(';')[0].split('=')[0]
      );*/
      /*const accessTokenCookie = cookies((cookie: string) =>
        cookie.startsWith('accessToken=')
      );*/
      //console.log('d', accessTokenCookie);

      //console.log('d', (cookies[0].accessToken ));
    });
  });
  describe('Fields are missing', () => {
    it('should return 400 status code if email field missing', async () => {
      //arrange
      const userData = {
        firstName: 'z',
        lastName: 'z',
        email: '',
        password: 'z',
      };
      //act

      const response = await request(app).post('/auth/register').send(userData);
      //console.log(response);
      expect(response.statusCode).toBe(400);

      const userRepository = connection.getRepository(User);
      expect((await userRepository.find()).length).toBe(0);
      //assert
      //console.log(response.body.user.password);
      //expect(response.body.user.password).not.toBe(userData.password);
    });

    it('should return 400 status code if firstName field missing', async () => {
      //arrange
      const userData = {
        firstName: '',
        lastName: 'z',
        email: 'a@a.com',
        password: 'z',
      };
      //act

      const response = await request(app).post('/auth/register').send(userData);

      expect(response.statusCode).toBe(400);

      const userRepository = connection.getRepository(User);
      expect((await userRepository.find()).length).toBe(0);
      //assert
      //console.log(response.body.user.password);
      //expect(response.body.user.password).not.toBe(userData.password);
    });

    it('should return 400 status code if lastName field missing', async () => {
      //arrange
      const userData = {
        firstName: 'c',
        lastName: '',
        email: 'a@a.com',
        password: 'z',
      };
      //act

      const response = await request(app).post('/auth/register').send(userData);

      expect(response.statusCode).toBe(400);

      const userRepository = connection.getRepository(User);
      expect((await userRepository.find()).length).toBe(0);
      //assert
      //console.log(response.body.user.password);
      //expect(response.body.user.password).not.toBe(userData.password);
    });

    it('should return 400 status code if password field is less than 8 character', async () => {
      //arrange
      const userData = {
        firstName: 'c',
        lastName: 'c',
        email: 'a@a.com',
        password: '',
      };
      //act

      const response = await request(app).post('/auth/register').send(userData);

      expect(response.statusCode).toBe(400);

      //assert
      //console.log(response.body.user.password);
      //expect(response.body.user.password).not.toBe(userData.password);
    });
  });

  describe('Fields should be in proper format', () => {
    it('should trim the email', async () => {
      //arrange
      const userData = {
        firstName: 'z',
        lastName: 'z',
        email: 'a@a.com ',
        password: 'z',
      };
      //act

      const response = await request(app).post('/auth/register').send(userData);
      //expect(response.statusCode).toBe(400);

      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      //console.log(users[0].email);
      console.log(userData.email);
      expect(users[0].email).toBe('a@a.com');
      //assert
      //console.log(response.body.user.password);
      //expect(response.body.user.password).not.toBe(userData.password);
    });

    it('should return the email status code if email is not valid', async () => {
      //arrange
      const userData = {
        firstName: 'z',
        lastName: 'z',
        email: 'a@a',
        password: 'z',
      };
      //act

      const response = await request(app).post('/auth/register').send(userData);
      expect(response.statusCode).toBe(400);

      //assert
      //console.log(response.body.user.password);
      //expect(response.body.user.password).not.toBe(userData.password);
    });
  });
});
