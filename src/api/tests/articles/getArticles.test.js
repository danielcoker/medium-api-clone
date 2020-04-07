import app from '../../../config/app';
import supertest from 'supertest';
import {
  connectMongoose,
  clearDatabase,
  disconnectMongoose
} from '../helpers/dbHandler';

const request = supertest(app);

describe('Get Articles Test', () => {
  beforeAll(connectMongoose);

  beforeEach(clearDatabase);

  afterAll(disconnectMongoose);

  test('get single article', async done => {
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

    const createArticleResponse = await request
      .post('/api/v1/articles')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'New Article Title',
        description: 'New Article Description',
        body: 'New Article Body'
      });

    const getArticleResponse = await request.get(
      '/api/v1/articles/new-article-title'
    );

    expect(getArticleResponse.status).toBe(200);
    expect(getArticleResponse.body.success).toBeTruthy();

    done();
  });

  test('cannot get articles that does not exist', async done => {
    const getArticleResponse = await request.get(
      '/api/v1/articles/new-article-title'
    );

    expect(getArticleResponse.status).toBe(404);
    expect(getArticleResponse.body.success).toBeFalsy();

    done();
  });
});
