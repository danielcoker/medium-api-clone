import app from '../../../config/app';
import supertest from 'supertest';
import {
  connectMongoose,
  clearDatabase,
  disconnectMongoose
} from '../helpers/dbHandler';

const request = supertest(app);

describe('User Password Update Tests', () => {
  beforeAll(connectMongoose);

  beforeEach(clearDatabase);

  afterAll(disconnectMongoose);

  test('updates user password successfully', async done => {
    const newUser = await request.post('/api/v1/auth/register').send({
      name: 'New User',
      email: 'newuser@gmail.com',
      username: 'newuser',
      password: 'olduserpassword',
      confirmPassword: 'olduserpassword'
    });

    const loggedInUser = await request.post('/api/v1/auth/login').send({
      email: 'newuser@gmail.com',
      password: 'olduserpassword'
    });

    const token = loggedInUser.body.data.token;

    const updateUserPasswordResponse = await request
      .put('/api/v1/auth/user/password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        currentPassword: 'olduserpassword',
        password: 'newpassword',
        confirmPassword: 'newpassword'
      });

    expect(updateUserPasswordResponse.status).toBe(200);
    expect(updateUserPasswordResponse.body.success).toBeTruthy();

    done();
  });

  test('returns error if current password does not match record', async done => {
    const newUser = await request.post('/api/v1/auth/register').send({
      name: 'New User',
      email: 'newuser@gmail.com',
      username: 'newuser',
      password: 'olduserpassword',
      confirmPassword: 'olduserpassword'
    });

    const loggedInUser = await request.post('/api/v1/auth/login').send({
      email: 'newuser@gmail.com',
      password: 'olduserpassword'
    });

    const token = loggedInUser.body.data.token;

    const updateUserPasswordResponse = await request
      .put('/api/v1/auth/user/password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        currentPassword: 'wrongcurrentpassword',
        password: 'newpassword',
        confirmPassword: 'newpassword'
      });

    expect(updateUserPasswordResponse.status).toBe(400);
    expect(updateUserPasswordResponse.body.success).toBeFalsy();

    done();
  });

  test('requests reset password link', async done => {
    const newUser = await request.post('/api/v1/auth/register').send({
      name: 'New User',
      email: 'newuser@gmail.com',
      username: 'newuser',
      password: 'newuserpassword',
      confirmPassword: 'newuserpassword'
    });

    const resetPasswordResponse = await request
      .post('/api/v1/auth/password/request')
      .send({ email: 'newuser@gmail.com' });

    expect(resetPasswordResponse.status).toBe(200);
    expect(resetPasswordResponse.body.success).toBeTruthy();
    expect(resetPasswordResponse.body.message).toMatch(/sent to your mail/);

    done();
  });

  // test('resets password successfully', async done => {
  //   const newUser = await request.post('/api/v1/auth/register').send({
  //     name: 'New User',
  //     email: 'newuser@gmail.com',
  //     username: 'newuser',
  //     password: 'olduserpassword',
  //     confirmPassword: 'olduserpassword'
  //   });

  //   const token = newUser.body.data.resetPasswordToken;

  //   const changePasswordResponse = await request
  //     .put(`/api/v1/auth/password/reset/${token}`)
  //     .send({
  //       password: 'newuserpassword',
  //       confirmPassword: 'newuserpassword'
  //     });

  //   expect(changePasswordResponse.status).toBe(200);
  //   expect(changePasswordResponse.body.success).toBeTruthy();
  //   expect(changePasswordResponse.body.message).toMatch(/Password changed/);

  //   done();
  // });
});
