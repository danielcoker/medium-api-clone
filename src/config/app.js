import express from 'express';
import uuid from 'uuid/v4';
import morgan from 'morgan';
import { log, logMiddleware } from '../api/utils/logger';
import routes from '../api/routes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use((req, res, next) => {
  const reqId = uuid();
  res.locals.log = log.child({ reqId });
  next();
});

// Enabling CORS for browser clients
app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

app.use('/api/v1/', routes);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.locals.log.error(
    `Error processing request for route: ${req.method} ${req.route.path}`
  );
  res.locals.log.error(err);
  return res
    .status(500)
    .json({ success: false, message: 'Unable to complete operation' });
});

export default app;
