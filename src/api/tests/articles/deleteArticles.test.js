import app from '../../../config/app';
import supertest from 'supertest';
import {
  connectMongoose,
  clearDatabase,
  disconnectMongoose
} from '../helpers/dbHandler';

const request = supertest(app);

describe('Delete Articles Test', () => {
  beforeAll(connectMongoose);

  beforeEach(clearDatabase);

  afterAll(disconnectMongoose);

  test('logged in users can delete articles', async done => {
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

    const deleteArticleResponse = await request
      .delete('/api/v1/articles/new-article-title')
      .set('Authorization', `Bearer ${token}`);

    const getArticleResponse = await request.get(
      '/api/v1/articles/new-article-title'
    );

    expect(deleteArticleResponse.status).toBe(204);
    expect(getArticleResponse.status).toBe(404);

    done();
  });

  test('guests users cannot delete articles', async done => {
    const deleteArticleResponse = await request.delete(
      '/api/v1/articles/new-article-title'
    );

    expect(deleteArticleResponse.status).toBe(401);

    done();
  });
});
