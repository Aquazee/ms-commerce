import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Crypto from './crypto';
import logger from './logger';

function send(res: Response): void {
  let obj = {};
  obj = res.locals.data;
  if (environment.applyEncryption) {
    obj = Crypto.encrypt(JSON.stringify(obj), environment.secretKey);
  }
  res.status(StatusCodes.OK).send(obj);
}

function json(res: Response): void {
  let obj = {};
  obj = res.locals.data;
  if (environment.applyEncryption) {
    obj = Crypto.encrypt(JSON.stringify(obj), environment.secretKey);
  }
  res.status(StatusCodes.OK).json(obj);
}

export { send, json };
