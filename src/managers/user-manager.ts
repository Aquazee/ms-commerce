import bcrypt from 'bcryptjs';
import { NextFunction } from 'express';
import BaseApi from '../components/BaseApi';
import { IUser, IUserDoc } from '../interfaces/user.interface';
import { UserError } from '../lib/errors';

interface IUserManager {
  isUserBlocked: (user: IUserDoc) => void;
  isUserInactive: (user: IUserDoc) => void;
}

class UserManager implements IUserManager {
  isGuest(user: IUser) {
    if ('is_active' in user) {
      return false;
    }
    return true;
  }

  isUserBlocked(user: IUser) {
    if (user.is_blocked === 1) {
      throw UserError.UserInactive;
    }
  }

  isUserInactive(user: IUser) {
    if (user.is_active === 0) {
      throw UserError.UserInactive;
    }
  }
}

export default UserManager;
