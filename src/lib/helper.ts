import { Express, Request } from 'express';
import mongoose from 'mongoose';
import requestIp from 'request-ip';
import { UserError } from './errors';

export const convertToObjectId = (id: string) =>
  new mongoose.Types.ObjectId(id);

/**
 * Check if Object Id sent is valid
 * @param {String} id
 */
export const isValidObjectID = async (id: string) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return id;
  }
  throw UserError.InvalidId;
};

/**
 * Gets IP from user
 * @param {*} req - request object
 */
export const getIP = (req: Request) => requestIp.getClientIp(req);

/**
 * Gets browser info from user
 * @param {*} req - request object
 */
export const getBrowserInfo = (req: Request) => req.headers['user-agent'];

/**
 * Gets country from user using CloudFlare header 'cf-ipcountry'
 * @param {*} req - request object
 */
export const getCountry = (req: Request) =>
  req.headers['cf-ipcountry'] ? req.headers['cf-ipcountry'] : 'XX';
