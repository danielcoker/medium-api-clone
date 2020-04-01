import app from '../../../config/app';
import supertest from 'supertest';
import {
  connectMongoose,
  clearDatabase,
  disconnectMongoose
} from '../helpers/dbHandler';

const request = supertest(app);

describe('User Registration Test', () => {
  beforeAll(connectMongoose);

  beforeEach(clearDatabase);

  afterAll(disconnectMongoose);

  test('registers user successfully', async done => {
    const response = await request.post('/api/v1/auth/register').send({
      name: 'New User',
      email: 'newuser@gmail.com',
      username: 'newuser',
      password: 'newuserpassword',
      confirmPassword: 'newuserpassword'
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBeTruthy();
    expect(response.body.data.email).toBe('newuser@gmail.com');

    done();
  });

  test('returns error for same email address during registration', async done => {
    const firstUser = await request.post('/api/v1/auth/register').send({
      name: 'New User',
      email: 'sameemail@gmail.com',
      username: 'firstusername',
      password: 'newuserpassword',
      confirmPassword: 'newuserpassword'
    });

    const secondUser = await request.post('/api/v1/auth/register').send({
      name: 'New User',
      email: 'sameemail@gmail.com',
      username: 'secondusername',
      password: 'newuserpassword',
      confirmPassword: 'newuserpassword'
    });

    expect(secondUser.status).toBe(400);
    expect(secondUser.body.success).toBeFalsy();
    expect(secondUser.body.message).toMatch(/email already exist./);

    done();
  });

  test('returns error for same username during registration', async done => {
    const firstUser = await request.post('/api/v1/auth/register').send({
      name: 'New User',
      email: 'firstemail@gmail.com',
      username: 'sameusername',
      password: 'newuserpassword',
      confirmPassword: 'newuserpassword'
    });

    const secondUser = await request.post('/api/v1/auth/register').send({
      name: 'New User',
      email: 'secondemail@gmail.com',
      username: 'sameusername',
      password: 'newuserpassword',
      confirmPassword: 'newuserpassword'
    });

    expect(secondUser.status).toBe(400);
    expect(secondUser.body.success).toBeFalsy();
    expect(secondUser.body.message).toMatch(/username already exist/);

    done();
  });

  test('returns error on empty required fields', async done => {
    const response = await request.post('/api/v1/auth/register').send({});

    expect(response.status).toBe(400);
    expect(response.body.success).toBeFalsy();

    done();
  });

  test('updates user details', async done => {
    const newUser = await request.post('/api/v1/auth/register').send({
      name: 'New User',
      email: 'newuser@gmail.com',
      username: 'newuser',
      password: 'newuserpassword',
      confirmPassword: 'newuserpassword'
    });

    const loggedInUser = await request.post('/api/v1/auth/login').send({
      email: 'newuser@gmail.com',
      password: 'newuserpassword'
    });

    const token = loggedInUser.body.data.token;

    const updateUserDetailsResponse = await request
      .put('/api/v1/auth/user')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated name',
        email: 'updatedemail@gmail.com',
        username: 'updatedusername'
      });

    expect(updateUserDetailsResponse.status).toBe(200);
    expect(updateUserDetailsResponse.body.success).toBeTruthy();
    expect(updateUserDetailsResponse.body.data.user.name).toBe('Updated name');
    expect(updateUserDetailsResponse.body.data.user.email).toBe(
      'updatedemail@gmail.com'
    );
    expect(updateUserDetailsResponse.body.data.user.username).toBe(
      'updatedusername'
    );

    done();
  });
});
