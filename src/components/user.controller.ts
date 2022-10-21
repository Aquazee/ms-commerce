import { Application, NextFunction, Request, Response } from 'express';

import { IUserDoc, IUserService } from '../interfaces/user.interface';
import { UserError } from '../lib/errors';
import * as responsehandler from '../lib/response-handler';
import Validator from '../middleware/validator';
import UserService from '../services/user.service';
// import getUserValidation from '../validations/get-user.validate';
import BaseApi from './BaseApi';

/**
 * Status controller
 */
export default class UserController extends BaseApi {
  private _userService: IUserService;

  constructor(express: Application) {
    super();
    this.register(express);
    this._userService = new UserService();
  }

  public register(express: Application): void {
    express.use('/api/user', this.router);
    this.router.get(
      '/:userId',
      Validator('getUserValidation'),
      this.getUser.bind(this)
    );
    this.router.post(
      '/',
      Validator('registerUserValidation'),
      this.registerUser.bind(this)
    );
    this.router.put(
      '/:userId',
      Validator('updateUserValidation'),
      this.updateUser.bind(this)
    );
  }

  public async getUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await this._userService.getUserById(req.body);
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
      const user = await this._userService.registerUser(req.body);
      const response: IUserDoc | null = user;
      res.locals.data = response;
      responsehandler.send(res);
    } catch (err: any) {
      let error;
      if (err.code === 11000) {
        error = UserError.EmailTaken;
      }
      next(error);
    }
  }

  public async verifyUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await this._userService.verifyUser(req.body);
      const response: IUserDoc | null = user;
      res.locals.data = response;
      responsehandler.send(res);
    } catch (err: any) {
      let error;
      if (err.code === 11000) {
        error = UserError.EmailTaken;
      }
      next(error);
    }
  }

  public async updateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await this._userService.updateUserById(
        req.params.userId,
        req.body
      );
      const response: IUserDoc | null = user;
      res.locals.data = response;
      responsehandler.send(res);
    } catch (err) {
      next(err);
    }
  }
}
