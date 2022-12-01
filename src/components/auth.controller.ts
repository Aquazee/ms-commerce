import { Application, NextFunction, Request, Response } from 'express';
import passport from 'passport';

import ApiError from '../abstractions/ApiError';
import {
  IRegisterResponse,
  IUser,
  IUserDoc,
  IUserService,
  IResendVerificationEmail,
  IVerifyUserRequestParams,
} from '../interfaces/user.interface';
import { UserError } from '../lib/errors';
import * as responsehandler from '../lib/response-handler';
import Validator from '../middleware/validator';
import AuthService from '../services/auth.service';
import UserService from '../services/user.service';
import BaseApi from './BaseApi';

const requireAuth = passport.authenticate('jwt', {
  session: false,
});

/**
 * Status controller
 */
export default class AuthController extends BaseApi {
  private _userService;

  private _authService;

  constructor(express: Application) {
    super();
    this.register(express);
    this._userService = new UserService();
    this._authService = new AuthService();
  }

  public register(express: Application): void {
    const { google, facebook } = this.config.third_party.login;
    express.use('/auth', this.router);
    this.router.post(
      '/register',
      Validator('registerUserValidation'),
      this.registerUser.bind(this)
    );
    this.router.post(
      '/login',
      Validator('loginUserValidation'),
      this.loginUser.bind(this)
    );
    this.router.get(
      '/token',
      requireAuth,
      // Validator('getRefreshToken'),
      this.getRefreshToken.bind(this)
    );

    this.router.post(
      '/forgot-password',
      Validator('forgotPassword'),
      this.forgotPassword.bind(this)
    );
    this.router.get(
      '/verify-user/:userId/email/:fcode',
      Validator('verifyUser'),
      this.verifyUser.bind(this)
    );
    this.router.get(
      '/facebook',
      passport.authenticate('facebook', {
        failureRedirect: '/',
        // session: false,
      })
    );
    this.router.get(
      facebook.callback_url,
      passport.authenticate('facebook', {
        failureRedirect: '/login?login=failed',
      }),
      this.sociallogin.bind(this)
    );
    this.router.post('/google', passport.authenticate('google'));
    this.router.get(
      google.callback_url,
      passport.authenticate('google', {
        failureRedirect: '/login?login=failed',
      }),
      this.sociallogin.bind(this)
    );
    this.router.post(
      '/resend-verification-email',
      Validator('resendVerificationEmail'),
      this.resendVerificationEmail.bind(this)
    );
  }

  public async registerUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await this._authService.registerUser(req.body);
      this.sendResponse(null, res);
    } catch (err: any) {
      next(err);
    }
  }

  public async resendVerificationEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const response = await this._authService.resendVerificationEmail(
        req.body as unknown as IResendVerificationEmail
      );
      this.sendResponse(response, res);
    } catch (err: any) {
      next(err);
    }
  }

  public async loginUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const response = await this._authService.loginUser(req.body);
      this.sendResponse(response, res);
    } catch (err: any) {
      next(err);
    }
  }

  getRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = await this._authService.getRefreshToken(
        req.headers.authorization as string
      );
      this.sendResponse(token, res);
    } catch (err: any) {
      next(err);
    }
  };

  public async sociallogin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const token = await this._authService.checkUserAccount(req.user as IUser);
      res.redirect(`http://localhost:3001/?token=${token};`);
    } catch (err: any) {
      next(err);
    }
  }

  public async verifyUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await this._authService.verifyUser(
        req.params as unknown as IVerifyUserRequestParams
      );
      this.sendResponse(null, res);
    } catch (err: any) {
      next(err);
    }
  }

  public async forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await this._authService.forgotPassword(req.body);
      this.sendResponse(null, res);
    } catch (err: any) {
      next(err);
    }
  }

  sendResponse(
    authData: IUser | IRegisterResponse | any | null,
    res: Response
  ) {
    res.locals.data = authData;
    responsehandler.send(res);
  }
}
