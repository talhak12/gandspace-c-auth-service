import app from './src/app';
import { calculateDiscount } from './src/utils';
import request from 'supertest';

describe('App', () => {
  it('should return correct discount amount', () => {
    const dicount = calculateDiscount(1, 1);
    expect(dicount).toBe(0.01);
  });

  it('should return 200 status code', async () => {
    const response = await request(app).get('/').send();
    expect(response.statusCode).toBe(200);
  });
});
