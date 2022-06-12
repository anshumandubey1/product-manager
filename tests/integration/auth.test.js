require('../database.test');

const request = require('supertest');
const app = require('../../app');

describe('User Authorization', () => {
  const user = {
    email: `abc${Date.now()}@gmail.com`,
    password: '123',
  };

  it('should save user data to database when unique email is provided', async () => {
    const response = await request(app)
      .post('/signup')
      .send(user)
      .set('Accept', 'application/json');
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.status).toEqual(200);
    expect(response.body.success).toBeTruthy();
    expect(response.body.user).toBeTruthy();
    expect(response.body.user.email).toBe(user.email);
  });

  it('should not save user data to database when unique email is not provided', async () => {
    const response = await request(app)
      .post('/signup')
      .send(user)
      .set('Accept', 'application/json');
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.status).not.toEqual(200);
    expect(response.body.success).toBeFalsy();
  });

  it('should return token when valid credentials are provided', async () => {
    const response = await request(app)
      .post('/login')
      .send(user)
      .set('Accept', 'application/json');
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.status).toEqual(200);
    expect(response.body.success).toBeTruthy();
    expect(response.body.token).toBeTruthy();
  });

  it('should not return token when incorrect email is provided with correct password', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'abc@gmail.com',
        password: user.password,
      })
      .set('Accept', 'application/json');
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.status).not.toEqual(200);
    expect(response.body.success).toBeFalsy();
    expect(response.body.token).toBeFalsy();
  });

  it('should not return token when correct email is provided with incorrect password', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: user.email,
        password: user.password + 'abc',
      })
      .set('Accept', 'application/json');
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.status).not.toEqual(200);
    expect(response.body.success).toBeFalsy();
    expect(response.body.token).toBeFalsy();
  });
});
