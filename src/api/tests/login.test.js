import app from '../../config/app';
import supertest from 'supertest';
import {
  connectMongoose,
  clearDatabase,
  disconnectMongoose
} from './helpers/dbHandler';

const request = supertest(app);

describe('User Login Test', () => {
  beforeAll(connectMongoose);

  beforeEach(clearDatabase);

  afterAll(disconnectMongoose);

  test('logs in user successfully', async done => {
    const newUser = await request.post('/api/v1/auth/register').send({
      name: 'New user',
      email: 'newuser@gmail.com',
      username: 'newuser',
      password: 'newuserpassword',
      confirmPassword: 'newuserpassword'
    });

    const response = await request.post('/api/v1/auth/login').send({
      email: 'newuser@gmail.com',
      password: 'newuserpassword'
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBeTruthy();
    expect(response.body.data.token).toBeDefined();

    done();
  });

  test('returns error if required fields are empty', async done => {
    const newUser = await request.post('/api/v1/auth/register').send({});

    const response = await request.post('/api/v1/auth/login').send({});

    expect(response.status).toBe(400);
    expect(response.body.success).toBeFalsy();

    done();
  });

  test('returns unauthorized user error if user does not exist', async done => {
    const response = await request.post('/api/v1/auth/login').send({
      email: 'invaliduser@gmail.com',
      password: 'invaliduserpassword'
    });

    expect(response.status).toBe(401);
    expect(response.body.success).toBeFalsy();

    done();
  });

  it('returns error if password is incorrect', async done => {
    const newUser = await request.post('/api/v1/auth/register').send({
      name: 'New user',
      email: 'newuser@gmail.com',
      username: 'newuser',
      password: 'newuserpassword',
      confirmPassword: 'newuserpassword'
    });

    const response = await request.post('/api/v1/auth/login').send({
      email: 'newuser@gmail.com',
      password: 'wrongpassword'
    });

    expect(response.status).toBe(401);
    expect(response.body.success).toBeFalsy();

    done();
  });
});
