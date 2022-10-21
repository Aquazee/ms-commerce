import { Types, Model, Document } from 'mongoose';
import { IAddressModel } from './common.interface';
import { AccessAndRefreshTokens } from './token.interface';

export interface IUser {
  user_name: string;
  name: string;
  mobile: string;
  email: string;
  password: string;
  address: IAddressModel;
  is_email_verified: boolean;
}

export interface IUserDoc extends IUser, Document {
  isPasswordMatch(password: string): Promise<boolean>;
}

export type UpdateUserBody = Partial<IUser>;

export type NewRegisteredUser = Omit<IUser, 'role' | 'isEmailVerified'>;

export type NewCreatedUser = Omit<IUser, 'isEmailVerified'>;

export interface IUserWithTokens {
  user: IUserDoc;
  tokens: AccessAndRefreshTokens;
}

export interface IUserModel extends Model<IUserDoc> {
  isEmailTaken(email: string, excludeUserId?: Types.ObjectId): Promise<boolean>;
}

export interface IUserInterface {
  userValidation: any;
}

export interface IUserService {
  // constructor: () => void;
  createUser: (userBody: NewCreatedUser) => Promise<IUserDoc>;
  updateUserById: (
    userId: string,
    updateBody: UpdateUserBody
  ) => Promise<IUserDoc | null>;
  registerUser: (userBody: NewCreatedUser) => Promise<IUserDoc>;
  getUserByEmail: (email: string) => Promise<IUserDoc | null>;
  getUserById: (id: string) => Promise<IUserDoc | null>;
  verifyUser: (id: string) => Promise<IUserDoc | null>;
}
