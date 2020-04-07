import app from '../../../config/app';
import supertest from 'supertest';
import {
  connectMongoose,
  clearDatabase,
  disconnectMongoose
} from '../helpers/dbHandler';

const request = supertest(app);

describe('Articles Test', () => {
  beforeAll(connectMongoose);

  beforeEach(clearDatabase);

  afterAll(disconnectMongoose);

  test('logged in users can update articles', async done => {
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

    const updateArticleResponse = await request
      .put('/api/v1/articles/new-article-title')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated Article Title',
        description: 'Updated Article Description',
        body: 'Updated Article Body'
      });

    expect(updateArticleResponse.status).toBe(200);
    expect(updateArticleResponse.body.success).toBeTruthy();
    expect(updateArticleResponse.body.data.title).toBe('Updated Article Title');

    done();
  });

  test('guests users cannot update articles', async done => {
    const updateArticleResponse = await request
      .put('/api/v1/articles/new-article-title')
      .send({
        title: 'New Article Title',
        description: 'New Article Description',
        body: 'New Article Body'
      });

    expect(updateArticleResponse.status).toBe(401);
    expect(updateArticleResponse.body.success).toBeFalsy();

    done();
  });

  test('numbers are not appended to slug if title is not modified', async done => {
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

    const firstArticleResponse = await request
      .post('/api/v1/articles')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'New Article Title',
        description: 'New Article Description',
        body: 'New Article Body'
      });

    const secondArticleResponse = await request
      .post('/api/v1/articles')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'New Article Title',
        description: 'New Article Description',
        body: 'New Article Body'
      });

    const updateSecondArticle = await request
      .put('/api/v1/articles/new-article-title-1')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'New Article Title',
        description: 'New Article Description',
        body: 'New Article Body'
      });

    expect(updateSecondArticle.body.data.slug).toBe('new-article-title-1');

    done();
  });

  test('slugs are checked appropiately to make them unique during update', async done => {
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

    const firstArticleResponse = await request
      .post('/api/v1/articles')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'New Article Title',
        description: 'New Article Description',
        body: 'New Article Body'
      });

    const secondArticleResponse = await request
      .post('/api/v1/articles')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'New Article Title',
        description: 'New Article Description',
        body: 'New Article Body'
      });

    const updateSecondArticle = await request
      .put('/api/v1/articles/new-article-title-1')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Update Article Title',
        description: 'New Article Description',
        body: 'New Article Body'
      });

    expect(updateSecondArticle.body.data.slug).toBe('update-article-title');

    done();
  });
});
