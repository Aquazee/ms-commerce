import httpStatus from 'http-status';
import mongoose, { Types } from 'mongoose';

import ApiError from '../abstractions/ApiError';
import { UserAccessor } from '../data-access';
import {
  NewCreatedUser,
  UpdateUserBody,
  IUserDoc,
} from '../interfaces/user.interface';
import { UserError } from '../lib/errors';
import User from '../models/user.model';

/**
 * Register a user
 * @param {NewCreatedUser} userBody
 * @returns {Promise<IUserDoc>}
 */
export const createUser = async (
  userBody: NewCreatedUser
): Promise<IUserDoc> => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(UserError.EmailTaken, httpStatus.BAD_REQUEST);
  }
  return UserAccessor.createUser(userBody);
};

/**
 * Get user by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IUserDoc | null>}
 */
export const getUserById = async (
  id: mongoose.Types.ObjectId
): Promise<IUserDoc | null> => User.findById(id);

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<IUserDoc | null>}
 */
export const getUserByEmail = async (email: string): Promise<IUserDoc | null> =>
  User.findOne({ email });

/**
 * Update user by id
 * @param {mongoose.Types.ObjectId} userId
 * @param {UpdateUserBody} updateBody
 * @returns {Promise<IUserDoc | null>}
 */
export const updateUserById = async (
  userId: string,
  updateBody: UpdateUserBody
): Promise<IUserDoc | null> => {
  const userIdObject = new mongoose.Types.ObjectId(userId);
  const user = await UserAccessor.getUserById(userIdObject);
  if (!user) {
    throw new ApiError(UserError.UserNotFound, httpStatus.NOT_FOUND);
  }
  if (
    updateBody.email &&
    (await User.isEmailTaken(updateBody.email, userIdObject))
  ) {
    throw new ApiError(UserError.EmailTaken, httpStatus.BAD_REQUEST);
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};
