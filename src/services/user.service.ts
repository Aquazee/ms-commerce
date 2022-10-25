import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

import MailAdapter from '../adapters/mail-adapter';
import UserAccessor from '../data-access/user-accessor';
import { IUserMailBaseData } from '../interfaces/mail.interface';
import {
  NewCreatedUser,
  UpdateUserBody,
  IUserDoc,
  IUserService,
  IUser,
  IGetUserRequest,
} from '../interfaces/user.interface';
import { UserError } from '../lib/errors';
import { convertToObjectId } from '../lib/helper';
import logger from '../lib/logger';
import UserManager from '../managers/user-manager';
import User from '../models/user.model';

const scope = `UserService#${1}`;

export default class UserService {
  private _userAccessor;

  private _userManager;

  constructor() {
    this._userAccessor = new UserAccessor();
    this._userManager = new UserManager();
  }

  /**
   * Create user
   * @param {NewCreatedUser} userBody
   * @returns {Promise<IUserDoc>}
   */
  createUser = async (userBody: NewCreatedUser): Promise<IUserDoc> =>
    this._userAccessor.createUser(userBody);

  /**
   * Get user by email
   * @param {string} email
   * @returns {Promise<IUserDoc | null>}
   */
  getUserByEmail = async (email: string) => {
    const user = await User.findOne({ email });
    if (!user) {
      throw UserError.UserNotFound;
    }
    return user;
  };

  /**
   * Update user by id
   * @param {string} userId
   * @param {UpdateUserBody} updateBody
   * @returns {Promise<IUserDoc | null>}
   */
  updateUserById = async (
    userId: string,
    updateBody: UpdateUserBody
  ): Promise<IUserDoc | null> => {
    const user = await this.getUserById(userId);
    await this.checkIsEmailTaken(updateBody.email);
    Object.assign(user, updateBody);
    await user.save();
    return user;
  };

  /**
   * Check Email already exists for other user
   * @param {string | undefined} userId
   * @returns {Promise<IUserDoc | null>}
   */
  checkIsEmailTaken = async (email: string | undefined) => {
    if (email && (await User.isEmailTaken(email))) {
      throw UserError.EmailTaken;
    }
  };

  getUser = async (payload: IGetUserRequest) => {
    const user = await this._userAccessor.getUserById(
      convertToObjectId(payload.userId as string)
    );
    if (!user) {
      throw UserError.UserNotFound;
    }
    return user;
  };

  getUserById = async (userId: string) => {
    const user = await this._userAccessor.getUserById(
      convertToObjectId(userId)
    );
    if (!user) {
      throw UserError.UserNotFound;
    }
    return user;
  };

  /**
   * Get user by Facebook id
   * @param {String} id
   * @returns {Promise<IUserDoc | null>}
   */
  getUserByFbId = async (id: string): Promise<IUserDoc | null> =>
    this.getUserBySocialId('facebook_id', id);

  /**
   * Get user by Google id
   * @param {String} id
   * @returns {Promise<IUserDoc | null>}
   */
  getUserByGoogleId = async (id: string): Promise<IUserDoc | null> =>
    this.getUserBySocialId('google_id', id);

  getUserBySocialId = async (
    socialPlatformName: string,
    id: string
  ): Promise<IUserDoc | null> =>
    this._userAccessor.getUserByQuery({ [`social.${socialPlatformName}`]: id });

  createUserEmailVerificationDetails = async (email: string) => {
    const user = await this.getUserByEmail(email);
    user.verification.email.fcode = uuidv4();
    user.verification.email.fcode_created = new Date();
    user.save();
    return user;
  };
}
