import request from 'supertest';
import app from '../../src/app';

describe('POST /auth/register', () => {
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
  });
  describe('Fields are missing', () => {});
});
