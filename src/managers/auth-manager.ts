import jwt from 'jsonwebtoken';
import _ from 'lodash';
import moment from 'moment';
import mongoose from 'mongoose';
import ServiceConfig from '../../setup/validate/config';
import {
  IUser,
  IUserDoc,
  IVerificationDetails,
} from '../interfaces/user.interface';
import Crypto from '../lib/crypto';
import { UserError } from '../lib/errors';

class AuthManager {
  private _config;

  private _crypto;

  constructor() {
    this._config = new ServiceConfig().config.service_config;
    this._crypto = new Crypto();
  }

  /**
   * Generates a token
   * @param {Object} user - user object
   */
  generateToken = (user: IUser) => {
    const { jwt_config, crypto_config } = this._config.server;
    // Gets expiration time
    const expiration =
      Math.floor(Date.now() / 1000) + 60 * jwt_config.expiry_mins;

    // returns signed and encrypted token
    return Crypto.encrypt(
      jwt.sign(
        {
          data: { _id: user },
          exp: expiration,
        },
        jwt_config.secret
      ),
      crypto_config.secret
    );
  };

  /**
   * Blocks a user by setting blockExpires
   * @param {Object} user - user object
   */
  blockUser = async (user: IUserDoc) => {
    const { block_hours } = this._config.server;
    const blockExpires = moment(new Date()).add(block_hours, 'h');
    _.set(user, 'block_expires', blockExpires);
  };

  /**
   * Checks that login attempts and blockexpires is less than now
   * @param {Object} user - user object
   */
  IsBlockExpired = (user: IUserDoc) => {
    const { allowed_login_attempt } = this._config.server;
    return (
      user.login_attempts > allowed_login_attempt &&
      user.block_expires <= new Date()
    );
  };

  /**
   *
   * @param {Object} user - user object.
   */
  checkLoginAttemptsAndBlockExpires = async (user: IUserDoc) => {
    // Let user try to login again after blockexpires, resets user loginAttempts
    if (this.IsBlockExpired(user)) {
      _.set(user, 'login_attempts', 0);
      return true;
    }
    return true;
  };

  getUserIdFromToken = async (token: string) => {
    try {
      const { jwt_config, crypto_config } = this._config.server;
      const decoded = jwt.verify(
        Crypto.decrypt(token, crypto_config.secret),
        jwt_config.secret
      );
      if (typeof decoded === 'string') {
        return JSON.parse(decoded).data._id;
      }
      return decoded.data._id;
    } catch (err) {
      throw UserError.InvalidToken;
    }
  };

  isValidVerification(
    emailVerificationDetails: IVerificationDetails,
    fcode: string
  ) {
    const fcodeMoment = moment(emailVerificationDetails.fcode_created);
    const now = moment();
    if (
      fcodeMoment.diff(now, 'days') >
        this._config.server.email_verification_max_days ||
      emailVerificationDetails.fcode !== fcode
    ) {
      throw UserError.InvalidEmailVerification;
    }
  }
}

export default AuthManager;
