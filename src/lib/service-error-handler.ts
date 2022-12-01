import logger from './logger';

const serviceErrorHandler: any = {};

function logError(errHead: string, err: Error) {
  logger.info(errHead);
  logger.error(err.name);
  logger.error(err.message);
  logger.error(err.stack);
}

serviceErrorHandler.sigError = (signal: any) => {
  logger.info(`Received ${signal}`);
};

serviceErrorHandler.handleExRe = (reason: Error) => {
  logError('Unhandled reason:', reason);
  logger.error(reason.stack);
  // application specific logging, throwing an error, or other logic here
};

serviceErrorHandler.beforeExitHandler = () => {
  logger.info('Process beforeExit, Add Cleanup functions ');
};

export default serviceErrorHandler;
