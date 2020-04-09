import app from '../../../config/app';
import supertest from 'supertest';
import {
  connectMongoose,
  clearDatabase,
  disconnectMongoose,
} from '../helpers/dbHandler';

const request = supertest(app);

describe('Add Comments Test', () => {
  beforeAll(connectMongoose);

  beforeEach(clearDatabase);

  afterAll(disconnectMongoose);

  test('logged in users can add comments to articles', async (done) => {
    const newUser = await request.post('/api/v1/auth/register').send({
      name: 'New User',
      email: 'newuser@gmail.com',
      username: 'newuser',
      password: 'newuserpassword',
      confirmPassword: 'newuserpassword',
    });

    const loggedInUserResponse = await request.post('/api/v1/auth/login').send({
      email: 'newuser@gmail.com',
      password: 'newuserpassword',
    });

    const token = loggedInUserResponse.body.data.token;

    const createArticleResponse = await request
      .post('/api/v1/articles')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'New Article Title',
        description: 'New Article Description',
        body: 'New Article Body',
      });

    const addCommentResponse = await request
      .post('/api/v1/articles/new-article-title/comments')
      .set('Authorization', `Bearer ${token}`)
      .send({ body: 'New Comment' });

    expect(addCommentResponse.status).toBe(201);
    expect(addCommentResponse.body.success).toBeTruthy();

    done();
  });

  test('guests users cannot add comments to articles', async (done) => {
    const addCommentResponse = await request
      .post('/api/v1/articles/my-article-title/comments')
      .send({ body: 'New Comment' });

    expect(addCommentResponse.status).toBe(401);
    expect(addCommentResponse.body.success).toBeFalsy();

    done();
  });
});
