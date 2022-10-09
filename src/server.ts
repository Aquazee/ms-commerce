import * as http from 'http';
import { AddressInfo } from 'net';
import mongoose from 'mongoose';

import App from './App';
import Environment from './environments/environment';
import { setGlobalEnvironment } from './global';
import logger from './lib/logger';
import serviceErrorHandler from './lib/service-error-handler';

const env: Environment = new Environment();
setGlobalEnvironment(env);
const app: App = new App();
let server: http.Server;

function serverError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') {
    throw error;
  }
  // handle specific error codes here.
  throw error;
}

function serverListening(): void {
  const addressInfo: AddressInfo = <AddressInfo>server.address();
  logger.info(`Listening on ${addressInfo.address}:${env.port}`);
}

app
  .init()
  .then(() => {
    mongoose.connect(process.env.DB_URL as string).then((res) => {
      logger.info('Db Connected');
      app.express.set('port', env.port);
      server = app.httpServer; // http.createServer(App);
      server.on('error', serverError);
      server.on('listening', serverListening);
      server.listen(env.port);
    });
  })
  .catch(serviceErrorHandler.handleExRe);

process.on('unhandledRejection', serviceErrorHandler.handleExRe);
process.on('uncaughtException', serviceErrorHandler.handleExRe);
process.on('beforeExit', serviceErrorHandler.beforeExitHandler);
process.on('exit', serviceErrorHandler.sigError);
process.on('SIGINT', serviceErrorHandler.sigError);
process.on('SIGTERM', serviceErrorHandler.sigError);
