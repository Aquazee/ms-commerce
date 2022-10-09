import { Application, NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import ApiError from '../abstractions/ApiError';
import { IUserDoc } from '../interfaces/user.interface';
import * as responsehandler from '../lib/response-handler';
import Validator from '../middleware/validator';
import {
  getUserByEmail,
  createUser,
  updateUserById,
} from '../services/user.service';
// import getUserValidation from '../validations/get-user.validate';
import BaseApi from './BaseApi';

/**
 * Status controller
 */
export default class UserController extends BaseApi {
  constructor(express: Application) {
    super();
    this.register(express);
  }

  public register(express: Application): void {
    express.use('/api/user', this.router);
    this.router.get('/:userId', Validator('getUserValidation'), this.getUser);
    this.router.post(
      '/',
      Validator('registerUserValidation'),
      this.registerUser
    );
    this.router.put(
      '/:userId',
      Validator('updateUserValidation'),
      this.updateUser
    );
  }

  public async getUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await getUserByEmail(req.body);
      const response: IUserDoc | null = user;
      res.locals.data = response;
      responsehandler.send(res);
    } catch (err) {
      next(err);
    }
  }

  public async registerUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await createUser(req.body);
      const response: IUserDoc | null = user;
      res.locals.data = response;
      responsehandler.send(res);
    } catch (err) {
      next(err);
    }
  }

  public async updateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await updateUserById(req.params.userId, req.body);
      const response: IUserDoc | null = user;
      res.locals.data = response;
      responsehandler.send(res);
    } catch (err) {
      next(err);
    }
  }
}
