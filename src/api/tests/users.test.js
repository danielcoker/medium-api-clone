import app from '../../config/app';
import supertest from 'supertest';
import dbHandler from './helpers/dbHandler';
import User from '../models/User';

const request = supertest(app);

describe('User Registration Test', () => {
  beforeAll(async () => await dbHandler.connect());

  afterAll(async () => await dbHandler.close());

  it('registers user successfully', async done => {
    const response = await request.post('/api/v1/auth/register').send({
      name: 'John Doe',
      email: 'john@gmail.com',
      password: 'Password321',
      confirmPassword: 'Password321'
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.email).toBe('john@gmail.com');

    done();
  });

  it('returns error for same email address during registration', async done => {
    const response = await request.post('/api/v1/auth/register').send({
      name: 'John Doe',
      email: 'john@gmail.com',
      password: 'Password321',
      confirmPassword: 'Password321'
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);

    done();
  });

  it('returns error on empty required fields', async done => {
    const response = await request.post('/api/v1/auth/register').send({});

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);

    done();
  });
});

describe('User Login Test', () => {
  beforeAll(async () => await dbHandler.connect());

  afterAll(async () => await dbHandler.close());

  it('logs in user successfully', async done => {
    const newUser = await request.post('/api/v1/auth/register').send({
      name: 'John Doe',
      email: 'john@gmail.com',
      password: 'Password321',
      confirmPassword: 'Password321'
    });

    const response = await request.post('/api/v1/auth/login').send({
      email: 'john@gmail.com',
      password: 'Password321'
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.token).toBeDefined();

    done();
  });

  it('returns error if required fields are empty', async done => {
    const newUser = await request.post('/api/v1/auth/register').send({
      name: 'John Doe',
      email: 'john@gmail.com',
      password: 'Password321',
      confirmPassword: 'Password321'
    });

    const response = await request.post('/api/v1/auth/login').send({});

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);

    done();
  });

  it('returns unauthorized user error if user does not exist', async done => {
    const response = await request.post('/api/v1/auth/login').send({
      email: 'johnny@gmail.com',
      password: 'password321'
    });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);

    done();
  });

  it('returns error if password is incorrect', async done => {
    const response = await request.post('/api/v1/auth/login').send({
      email: 'john@gmail.com',
      password: 'wrongpassword'
    });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);

    done();
  });
});
