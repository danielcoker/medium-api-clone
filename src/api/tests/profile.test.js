import app from '../../config/app';
import supertest from 'supertest';
import {
  connectMongoose,
  clearDatabase,
  disconnectMongoose
} from './helpers/dbHandler';

const request = supertest(app);

describe('Profile Test', () => {
  beforeAll(connectMongoose);

  beforeEach(clearDatabase);

  afterAll(disconnectMongoose);

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
      .put('/api/v1/profiles/newuser')
      .set('Authorization', `Bearer ${token}`)
      .send({
        bio: 'I am John Doe'
      });

    expect(updateProfileResponse.status).toBe(200);
    expect(updateProfileResponse.body.success).toBeTruthy();

    done();
  });

  test('updates logged in user profile image', async done => {
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

    const sampleImagePath =
      '/Users/admin/Documents/Node Projects/medium-api-clone/src/api/tests/helpers/sample_image.jpeg';

    const updateProfileImageResponse = await request
      .put('/api/v1/profiles/newuser/image')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', sampleImagePath);

    expect(updateProfileImageResponse.status).toBe(200);
    expect(updateProfileImageResponse.body.success).toBeTruthy();

    done();
  });
});
