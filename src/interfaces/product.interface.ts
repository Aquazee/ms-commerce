import { Types, Model, Document } from 'mongoose';
import { IAddressModel, IDeactivatedBy } from './common.interface';
import { AccessAndRefreshTokens } from './token.interface';

export interface Dimension {
  size: string;
  size_type: string;
  size_unit: string;
}

export interface Warranty {
  covered: string;
  not_covered: string;
  unit: string;
  span: number;
}

export interface SellerInfo {
  name: string;
  seller_id: string;
}

export interface Attachments {
  low_res: string;
  high_res: string;
  name: string;
  type: string;
  sequence: number;
}

export interface Specifications {
  material: any;
  pattern: any;
  dimensions: Dimension[];
  warranty: Warranty;
}

export interface IProduct {
  id?: string;
  brand?: string;
  custom_label?: string;
  title?: string;
  description?: string;
  attachments?: Attachments;
  link?: string;
  product_type?: string;
  gender?: string;
  specifications?: Specifications;
  handling_time?: any;
  manufacturer_info?: any;
  seller_info?: SellerInfo;
  created_by?: IDeactivatedBy;
  is_active: 0 | 1;
  deactivated_by: IDeactivatedBy[];
  updated_by: IDeactivatedBy[];
  __v: number;
}

export interface IProductDoc extends IProduct, Document {}

export type UpdateProductBody = Partial<IProduct>;

export type NewCreatedProduct = Omit<
  IProduct,
  'is_active' | 'created_by' | 'deactivated_by' | 'updated_by' | '__v'
>;

export interface IProductWithTokens {
  user: IProductDoc;
  tokens: AccessAndRefreshTokens;
}

export interface IProductModel extends Model<IProductDoc> {
  isLabelTaken(
    email: string,
    excludeProductId?: Types.ObjectId
  ): Promise<boolean>;
}

export interface IProductInterface {
  userValidation: any;
}

export interface IProductService {
  // constructor: () => void;
  createProduct: (userBody: NewCreatedProduct) => Promise<IProductDoc>;
  updateProductById: (
    userId: string,
    updateBody: UpdateProductBody
  ) => Promise<IProductDoc | null>;
  registerProduct: (userBody: NewCreatedProduct) => Promise<IProductDoc>;
  checkProductAccount: (userBody: IProduct) => Promise<string>;
  getProductByEmail: (email: string) => Promise<IProductDoc | null>;
  getProductById: (id: string) => Promise<IProductDoc | null>;
  verifyProduct: (id: string) => Promise<IProductDoc | null>;
  forgotPassword: (email: string) => Promise<void>;
}
