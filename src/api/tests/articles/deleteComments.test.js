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

  test('user can delete comment for an article', async (done) => {
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

    const commentId = addCommentResponse.body.data._id;

    const deleteCommentResponse = await request
      .delete(`/api/v1/articles/new-article-title/comments/${commentId}`)
      .set('Authorization', `Bearer ${token}`);

    const getCommentsResponse = await request.get(
      '/api/v1/articles/new-article-title/comments'
    );

    expect(deleteCommentResponse.status).toBe(204);
    expect(getCommentsResponse.body.success).toBeTruthy();
    expect(getCommentsResponse.body.data.length).toBe(0);

    done();
  });

  test('guest cannot delete comments', async (done) => {
    const commentId = null;

    const deleteCommentResponse = await request.delete(
      `/api/v1/articles/new-article-title/comments/${commentId}`
    );

    expect(deleteCommentResponse.status).toBe(401);
    expect(deleteCommentResponse.body.success).toBeFalsy();

    done();
  });
});
