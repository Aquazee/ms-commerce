import { Types, Model, Document } from 'mongoose';
import { IAddressModel, IDeactivatedBy } from './common.interface';
import { AccessAndRefreshTokens } from './token.interface';

export interface ISocialLogin {
  facebook_id: string;
  google_id: string;
}

export interface IVerificationDetails {
  is_verified: number;
  fcode: string;
}

export interface IVerification {
  email: IVerificationDetails;
  mobile: IVerificationDetails;
}

export interface ISubscription {
  email: number;
  mobile: number;
}

export interface IUser {
  id?: string;
  user_name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  mobile?: string;
  alt_mobile?: string;
  gender?: string;
  profile_pic?: string;
  country_code?: string;
  bank_details?: any;
  birthdate?: string;
  verification: IVerification;
  role?: string[];
  social?: ISocialLogin;
  address?: IAddressModel[];
  login_attempts: number;
  block_expires: Date;
  is_active: 0 | 1;
  is_blocked: 0 | 1;
  created_by?: IDeactivatedBy;
  deactivated_by: IDeactivatedBy[];
  updated_by: IDeactivatedBy[];
  __v: number;
}

export interface IUserDoc extends IUser, Document {
  isPasswordMatch(password: string): Promise<boolean>;
}

export type UpdateUserBody = Partial<IUser>;

export type NewRegisteredUser = Omit<
  IUser,
  | 'role'
  | 'is_active'
  | 'is_blocked'
  | 'created_by'
  | 'deactivated_by'
  | 'updated_by'
  | '__v'
  | 'verification'
>;

export type NewCreatedUser = Omit<
  IUser,
  | 'login_attempts'
  | 'block_expires'
  | 'role'
  | 'is_active'
  | 'is_blocked'
  | 'created_by'
  | 'deactivated_by'
  | 'updated_by'
  | '__v'
  | 'verification'
>;

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

export interface IRegisterResponse {
  token: any;
  user: IUserDoc;
}

export interface IUserService {
  // constructor: () => void;
  createUser: (userBody: NewCreatedUser) => Promise<IUserDoc>;
  updateUserById: (
    userId: string,
    updateBody: UpdateUserBody
  ) => Promise<IUserDoc | null>;
  registerUser: (userBody: NewCreatedUser) => Promise<IUserDoc>;
  checkUserAccount: (userBody: IUser) => Promise<string>;
  getUserByEmail: (email: string) => Promise<IUserDoc | null>;
  getUserById: (id: string) => Promise<IUserDoc | null>;
  verifyUser: (id: string) => Promise<IUserDoc | null>;
  forgotPassword: (email: string) => Promise<void>;
}
