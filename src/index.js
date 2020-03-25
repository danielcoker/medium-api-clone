import app from './config/app';
import config from './config/config';
import { log } from './api/utils/logger';

const server = app.listen(config.port, () => {
  log.info(`App listening on port ${config.port}`);
});

/**
 * Connect to database.
 */
config.connectDB();

export default server;
