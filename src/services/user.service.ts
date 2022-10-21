import httpStatus from 'http-status';

import ApiError from '../abstractions/ApiError';
import MailAdapter from '../adapters/mail-adapter';
import { UserAccessor } from '../data-access';
import { IUserMailBaseData, IUserMailData } from '../interfaces/mail.interface';
import {
  NewCreatedUser,
  UpdateUserBody,
  IUserDoc,
  IUserService,
} from '../interfaces/user.interface';
import { EmailTypeDetails } from '../lib/constants';
import { UserError } from '../lib/errors';
import { convertToObjectId } from '../lib/helper';
import User from '../models/user.model';

const scope = `UserService#${1}`;

export default class UserService implements IUserService {
  private _mailAdapter;

  constructor() {
    this._mailAdapter = new MailAdapter();
  }

  /**
   * Create user
   * @param {NewCreatedUser} userBody
   * @returns {Promise<IUserDoc>}
   */
  createUser = async (userBody: NewCreatedUser): Promise<IUserDoc> => {
    if (await User.isEmailTaken(userBody.email)) {
      throw UserError.EmailTaken;
    }
    return UserAccessor.createUser(userBody);
  };

  /**
   * Register a user
   * @param {NewCreatedUser} userBody
   * @returns {Promise<IUserDoc>}
   */
  registerUser = async (userBody: NewCreatedUser): Promise<IUserDoc> => {
    const user = await UserAccessor.createUser(userBody);
    const mailData: IUserMailBaseData = {
      body: user,
      event: EmailTypeDetails.UserEmailVerification.name,
    };
    await this._mailAdapter.sendEmail(mailData);
    return user;
  };

  /**
   * Register a user
   * @param {NewUserId} userId
   * @returns {Promise<IUserDoc>}
   */
  verifyUser = async (userId: string): Promise<IUserDoc> => {
    const convertedUserId = convertToObjectId(userId);
    const user = await UserAccessor.getUserById(convertedUserId);
    if (!user) {
      throw UserError.UserNotFound;
    }
    user.is_email_verified = true;
    await user.save();
    return user;
  };

  /**
   * Get user by id
   * @param {mongoose.Types.ObjectId} id
   * @returns {Promise<IUserDoc | null>}
   */
  getUserById = async (id: string): Promise<IUserDoc | null> =>
    User.findById(convertToObjectId(id));

  /**
   * Get user by email
   * @param {string} email
   * @returns {Promise<IUserDoc | null>}
   */
  getUserByEmail = async (email: string): Promise<IUserDoc | null> =>
    User.findOne({ email });

  /**
   * Update user by id
   * @param {mongoose.Types.ObjectId} userId
   * @param {UpdateUserBody} updateBody
   * @returns {Promise<IUserDoc | null>}
   */
  updateUserById = async (
    userId: string,
    updateBody: UpdateUserBody
  ): Promise<IUserDoc | null> => {
    const convertedUserId = convertToObjectId(userId);
    const user = await UserAccessor.getUserById(convertedUserId);
    if (!user) {
      throw UserError.UserNotFound;
    }
    if (
      updateBody.email &&
      (await User.isEmailTaken(updateBody.email, convertedUserId))
    ) {
      throw UserError.EmailTaken;
    }
    Object.assign(user, updateBody);
    await user.save();
    return user;
  };
}
