import app from '../../config/app';
import supertest from 'supertest';
import dbHandler from './helpers/dbHandler';

const request = supertest(app);

describe('Profile Test', () => {
  beforeAll(async () => await dbHandler.connect());

  afterAll(async () => await dbHandler.close());

  test('creates profile after registration', async done => {
    const response = await request.post('/api/v1/auth/register').send({
      name: 'John Doe',
      email: 'john@gmail.com',
      username: 'johndoe',
      password: 'Password321',
      confirmPassword: 'Password321'
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBeTruthy();
    expect(response.body.data.email).toBe('john@gmail.com');

    done();
  });

  test('updates logged in user profile', async done => {
    const loggedInUserResponse = await request.post('/api/v1/auth/login').send({
      email: 'john@gmail.com',
      password: 'Password321'
    });

    const updateProfileResponse = await request
      .post('/api/v1/profiles/johndoe')
      .set('Authorization', `Bearer ${loggedInUserResponse.body.data.token}`)
      .send({
        bio: 'I am John Doe'
      });

    expect(updateProfileResponse.status).toBe(200);
    expect(updateProfileResponse.body.success).toBeTruthy();

    done();
  });
});
