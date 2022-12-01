import mongoose from 'mongoose';

import {
  NewCreatedUser,
  UpdateUserBody,
  IUserDoc,
} from '../interfaces/user.interface';
import User from '../models/user.model';

export default class UserAccessor {
  /**
   * Register a user
   * @param {NewCreatedUser} userBody
   * @returns {Promise<IUserDoc>}
   */
  createUser = async (userBody: NewCreatedUser): Promise<IUserDoc> =>
    User.create(userBody);

  /**
   * Get user by id
   * @param {mongoose.Types.ObjectId} id
   * @returns {Promise<IUserDoc | null>}
   */
  getUserById = async (id: mongoose.Types.ObjectId): Promise<IUserDoc | null> =>
    User.findById(id);

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
    user: IUserDoc,
    updateBody: UpdateUserBody
  ): Promise<IUserDoc | null> => {
    Object.assign(user, updateBody);
    await user.save();
    return user;
  };

  /**
   * Update user by id
   * @param {mongoose.Types.ObjectId} userId
   * @param {UpdateUserBody} updateBody
   * @returns {Promise<IUserDoc | null>}
   */
  getUserByQuery = async (query: any): Promise<IUserDoc | null> =>
    User.findOne(query);
}
