import MailAdapter from '../adapters/mail-adapter';
import UserAccessor from '../data-access/user-accessor';
import { IUserMailBaseData } from '../interfaces/mail.interface';
import {
  NewCreatedUser,
  IUserDoc,
  IUser,
  IRegisterResponse,
} from '../interfaces/user.interface';
import { EmailTypeDetails } from '../lib/constants';
import { UserError } from '../lib/errors';
import { isValidObjectID } from '../lib/helper';
import logger from '../lib/logger';
import AuthManager from '../managers/auth-manager';
import UserManager from '../managers/user-manager';
import UserService from './user.service';

const scope = `UserService#${1}`;

export default class AuthService {
  private _mailAdapter;

  private _userAccessor;

  private _userManager;

  private _userService;

  private _authManager;

  constructor() {
    this._mailAdapter = new MailAdapter();
    this._userAccessor = new UserAccessor();
    this._userManager = new UserManager();
    this._userService = new UserService();
    this._authManager = new AuthManager();
  }

  /**
   * Register a user
   * @param {NewCreatedUser} userBody
   * @returns {Promise<IRegisterResponse>}
   */
  registerUser = async (
    userBody: NewCreatedUser
    // loginType: string
  ): Promise<IRegisterResponse> => {
    // if(loginType !== 'user'){
    //   this.getUserById(userId);
    // }
    const user = await this._userAccessor.createUser(userBody);
    await this.formDataAndSendEmail(user);
    return {
      token: this._authManager.generateToken(user._id),
      user,
    };
  };

  /**
   * Check User Account
   * @param {NewCreatedUser} userBody
   * @returns {Promise<IUserDoc>}
   */
  checkUserAccount = async (userBody: IUser): Promise<string> => {
    let token = '';
    let user;
    if (this._userManager.isGuest(userBody)) {
      user = await (await this._userAccessor.createUser(userBody)).toObject();
      await this.formDataAndSendEmail(user);
    } else {
      this._userManager.isUserBlocked(userBody);
      this._userManager.isUserInactive(userBody);
      user = userBody;
    }
    token = new AuthManager().generateToken(user);
    return token;
  };

  /**
   * Forgot Password
   * @param {NewUserId} userId
   * @returns {Promise<IUserDoc>}
   */
  forgotPassword = async (email: string): Promise<void> => {
    const user = await this._userService.getUserByEmail(email);
    await this.formDataAndSendEmail(user);
  };

  /**
   * Verify user
   * @param {NewUserId} userId
   * @returns {Promise<IUserDoc>}
   */
  verifyUser = async (userId: string): Promise<IUserDoc> => {
    const user = await this._userService.getUserById(userId);
    user.verification.email.is_verified = 1;
    return user.save();
  };

  formDataAndSendEmail = async (user: IUserDoc) => {
    if (user.email) {
      const mailData: IUserMailBaseData = {
        body: user,
        event: EmailTypeDetails.UserEmailVerification.name,
      };
      await this._mailAdapter.sendEmail(mailData);
    }
  };

  getRefreshToken = async (authToken: string) => {
    if (!authToken) {
      throw UserError.InvalidToken;
    }
    let userId = await this._authManager.getUserIdFromToken(
      authToken.replace('Bearer ', '').trim()
    );
    userId = await isValidObjectID(userId);
    const user = await this._userService.getUserById(userId);
    const token = this._authManager.generateToken(user);
    return token;
  };
}
