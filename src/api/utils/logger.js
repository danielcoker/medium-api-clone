import bunyan from 'bunyan';
import bformat from 'bunyan-format';
import expressRequestsLogger from 'express-requests-logger';
import dotenv from 'dotenv';

dotenv.config();

const formatOut = bformat({ outputMode: 'short' });

export const log = bunyan.createLogger({
  name: process.env.APP_NAME,
  stream: formatOut,
  level: process.env.LOG_LEVEL
});

export const logMiddleware = logger =>
  expressRequestsLogger({
    logger,
    request: {
      maskBody: ['password'],
      maskHeaders: ['authorization', 'token', 'auth-token']
    },
    response: {
      maskHeaders: ['authorization', 'token', 'auth-token']
    }
  });
