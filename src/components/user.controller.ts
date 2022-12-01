import { Application, NextFunction, Request, Response } from 'express';
import passport from 'passport';
import {
  IGetUserRequest,
  IUserDoc,
  IUserService,
} from '../interfaces/user.interface';
import { LoginType } from '../lib/constants';
import { UserError } from '../lib/errors';
import * as responsehandler from '../lib/response-handler';
import Validator from '../middleware/validator';
import UserService from '../services/user.service';
// import getUserValidation from '../validations/get-user.validate';
import BaseApi from './BaseApi';

const requireAuth = passport.authenticate('jwt', {
  session: false,
});
/**
 * Status controller
 */
export default class UserController extends BaseApi {
  private _userService;

  constructor(express: Application) {
    super();
    this.register(express);
    this._userService = new UserService();
  }

  public register(express: Application): void {
    express.use('/api/user', this.router);
    this.router.get(
      '/:userId',
      requireAuth,
      Validator('getUserValidation'),
      this.getUser.bind(this)
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
      const user = await this._userService.getUser(
        req.params as IGetUserRequest
      );
      this.sendResponse(user, res);
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
      const user = await this._userService.updateUserById(
        req.params.userId,
        req.body
      );
      this.sendResponse(user, res);
    } catch (err) {
      next(err);
    }
  }

  sendResponse(user: IUserDoc | null, res: Response) {
    res.locals.data = user;
    responsehandler.send(res);
  }
}
