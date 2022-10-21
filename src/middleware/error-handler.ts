import * as util from 'util';
import * as express from 'express';
import { StatusCodes } from 'http-status-codes';
import ApiError, { IError } from '../abstractions/ApiError';
import Crypto from '../lib/crypto';
import logger from '../lib/logger';

export interface IErrorHandler extends IError {
  stack: string;
}

const addErrorHandler = (
  err: ApiError,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void => {
  if (err) {
    const status: number = err.status || StatusCodes.INTERNAL_SERVER_ERROR;
    logger.debug(`REQUEST HANDLING ERROR:
        \nERROR:\n${JSON.stringify(err)}
        \nREQUEST HEADERS:\n${util.inspect(req.headers)}
        \nREQUEST PARAMS:\n${util.inspect(req.params)}
        \nREQUEST QUERY:\n${util.inspect(req.query)}
        \nBODY:\n${util.inspect(req.body)}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let body: IErrorHandler | string = {
      fields: err.fields,
      status,
      error: err.error,
      message: err.message || 'An error occurred during the request.',
      stack: '',
    };

    // If the environment is production then no need to send error stack trace
    if (environment.isDevEnvironment()) {
      body.stack = err.stack as string;
    }
    if (environment.applyEncryption) {
      body = Crypto.encrypt(JSON.stringify(body), environment.secretKey);
    }
    res.status(status).json(body);
  }
  next();
};

export default addErrorHandler;
