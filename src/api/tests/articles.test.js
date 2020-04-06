import app from '../../config/app';
import supertest from 'supertest';
import {
  connectMongoose,
  clearDatabase,
  disconnectMongoose
} from './helpers/dbHandler';

const request = supertest(app);

describe('Articles Test', () => {
  beforeAll(connectMongoose);

  beforeEach(clearDatabase);

  afterAll(disconnectMongoose);

  test('logged in users can create articles', async done => {
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

    expect(createArticleResponse.status).toBe(201);
    expect(createArticleResponse.body.success).toBeTruthy();
    expect(createArticleResponse.body.data.title).toBe('New Article Title');

    done();
  });

  test('guests users cannot create articles', async done => {
    const createArticleResponse = await request.post('/api/v1/articles').send({
      title: 'New Article Title',
      description: 'New Article Description',
      body: 'New Article Body'
    });

    expect(createArticleResponse.status).toBe(401);
    expect(createArticleResponse.body.success).toBeFalsy();

    done();
  });

  test('numbers are appended to slugs appropiately to make them unique', async done => {
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

    const thirdArticleResponse = await request
      .post('/api/v1/articles')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'New Article Title',
        description: 'New Article Description',
        body: 'New Article Body'
      });

    expect(firstArticleResponse.body.data.slug).toBe('new-article-title');
    expect(secondArticleResponse.body.data.slug).toBe('new-article-title-1');
    expect(thirdArticleResponse.body.data.slug).toBe('new-article-title-2');

    done();
  });
});
