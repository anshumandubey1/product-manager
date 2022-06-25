const request = require('supertest');
const app = require('../../app');

describe('User Authorization', () => {
  it('should return status as 404 if invalid url is given', async () => {
    const response = await request(app).get('/invalidURL');
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.status).toEqual(404);
  });
});
