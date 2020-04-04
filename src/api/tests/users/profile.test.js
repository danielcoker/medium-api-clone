import app from '../../../config/app';
import supertest from 'supertest';
import {
  connectMongoose,
  clearDatabase,
  disconnectMongoose
} from '../helpers/dbHandler';

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
      .put('/api/v1/profiles')
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
      .put('/api/v1/profiles/image')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', sampleImagePath);

    expect(updateProfileImageResponse.status).toBe(200);
    expect(updateProfileImageResponse.body.success).toBeTruthy();

    done();
  });

  test('logged user can follow a user', async done => {
    const newUser = await request.post('/api/v1/auth/register').send({
      name: 'New User',
      email: 'newuser@gmail.com',
      username: 'newuser',
      password: 'newuserpassword',
      confirmPassword: 'newuserpassword'
    });

    const anotherUser = await request.post('/api/v1/auth/register').send({
      name: 'New User',
      email: 'anotheruser@gmail.com',
      username: 'anotheruser',
      password: 'anotheruserpassword',
      confirmPassword: 'anotherusepassword'
    });

    const loggedInUserResponse = await request.post('/api/v1/auth/login').send({
      email: 'newuser@gmail.com',
      password: 'newuserpassword'
    });

    const token = loggedInUserResponse.body.data.token;

    const follwoUserResponse = await request
      .post('/api/v1/profiles/anotheruser/follow')
      .set('Authorization', `Bearer ${token}`);

    expect(follwoUserResponse.status).toBe(200);
    expect(follwoUserResponse.body.success).toBeTruthy();
    expect(follwoUserResponse.body.data.username).toBe('anotheruser');

    done();
  });

  test('logged user can follow a user', async done => {
    const newUser = await request.post('/api/v1/auth/register').send({
      name: 'New User',
      email: 'newuser@gmail.com',
      username: 'newuser',
      password: 'newuserpassword',
      confirmPassword: 'newuserpassword'
    });

    const anotherUser = await request.post('/api/v1/auth/register').send({
      name: 'New User',
      email: 'anotheruser@gmail.com',
      username: 'anotheruser',
      password: 'anotheruserpassword',
      confirmPassword: 'anotherusepassword'
    });

    const loggedInUserResponse = await request.post('/api/v1/auth/login').send({
      email: 'newuser@gmail.com',
      password: 'newuserpassword'
    });

    const token = loggedInUserResponse.body.data.token;

    const follwoUserResponse = await request
      .delete('/api/v1/profiles/anotheruser/follow')
      .set('Authorization', `Bearer ${token}`);

    expect(follwoUserResponse.status).toBe(200);
    expect(follwoUserResponse.body.success).toBeTruthy();
    expect(follwoUserResponse.body.data.username).toBe('anotheruser');

    done();
  });
});
