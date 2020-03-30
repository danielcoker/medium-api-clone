import app from '../../config/app';
import supertest from 'supertest';
import {
  connectMongoose,
  clearDatabase,
  disconnectMongoose
} from './helpers/dbHandler';

const request = supertest(app);

describe('Profile Test', () => {
  beforeEach(connectMongoose);

  beforeEach(clearDatabase);

  afterEach(disconnectMongoose);

  test('updates logged in user profile', async done => {
    const newUser = await request.post('/api/v1/auth/register').send({
      name: 'New User',
      email: 'newuser@gmail.com',
      username: 'newuser',
      password: 'newuserpassword',
      confirmPassword: 'newuserpassword'
    });

    const loggedInUserResponse = await request.post('/api/v1/auth/login').send({
      email: 'newuser@gmail.com',
      password: 'newuserpassword'
    });

    const token = loggedInUserResponse.body.data.token;

    const updateProfileResponse = await request
      .post('/api/v1/profiles/newuser')
      .set('Authorization', `Bearer ${token}`)
      .send({
        bio: 'I am John Doe'
      });

    expect(updateProfileResponse.status).toBe(200);
    expect(updateProfileResponse.body.success).toBeTruthy();

    done();
  });
});
