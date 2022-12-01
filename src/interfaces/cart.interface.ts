import { Types, Model, Document, PaginateModel } from 'mongoose';
import { IDeactivatedBy } from './common.interface';
import { AccessAndRefreshTokens } from './token.interface';

export interface ICart {
  id?: string;
  user_id?: string;
  user_details?: object;
  product_details?: object;
  delivery_details?: object;
  created_by?: IDeactivatedBy;
  is_active: 0 | 1;
  deactivated_by: IDeactivatedBy[];
  updated_by: IDeactivatedBy[];
  __v: number;
}

export interface ICartDoc extends Document, ICart {
  id: string;
  __v: number;
}

export type UpdateCartBody = Partial<ICart>;

export type NewCreatedCart = Omit<
  ICart,
  'is_active' | 'created_by' | 'deactivated_by' | 'updated_by' | '__v'
>;

export interface ICartWithTokens {
  cart: ICartDoc;
  tokens: AccessAndRefreshTokens;
}

// export type ICartModel = Model<ICartDoc>;
export interface ICartModel extends PaginateModel<ICartDoc> {
  isLabelTaken(email: string, excludeCartId?: Types.ObjectId): Promise<boolean>;
}

export interface ICartInterface {
  cartValidation: any;
}

export interface ICartService {
  // constructor: () => void;
  createCart: (cartBody: NewCreatedCart) => Promise<ICartDoc>;
  updateCartById: (
    cartId: string,
    updateBody: UpdateCartBody
  ) => Promise<ICartDoc | null>;
  getCartById: (id: string) => Promise<ICartDoc | null>;
}

export interface IGetCartRequest {
  cartId?: string;
}
