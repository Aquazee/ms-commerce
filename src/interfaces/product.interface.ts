import { Types, Model, Document, PaginateModel } from 'mongoose';
import { IAddressModel, IDeactivatedBy } from './common.interface';
import { AccessAndRefreshTokens } from './token.interface';

export interface Dimension {
  size: string;
  size_type: string;
  size_unit: string;
}

export interface IWarranty {
  covered: string;
  not_covered: string;
  unit: string;
  span: number;
}

export interface SellerInfo {
  name: string;
  seller_id: string;
}

export interface IAttachments {
  low_res: string;
  high_res: string;
  name: string;
  type: string;
  sequence: number;
}

export interface ISpecifications {
  material: any;
  pattern: any;
  dimensions: Dimension[];
  warranty: IWarranty;
}

export interface ITax {
  tax_type: string;
  tax_amount: string;
  taxable_on_value: string;
}

export interface ICost {
  mrp: number;
  selling_price: number;
  gross_amount: number;
  discount: number;
  tax_info: ITax;
  currency: string;
}
export interface IProduct {
  id?: string;
  brand?: string;
  custom_label?: string;
  title?: string;
  description?: string;
  attachments?: IAttachments;
  link?: string;
  product_type?: string;
  cost: ICost;
  gender?: string;
  specifications?: ISpecifications;
  handling_time?: any;
  manufacturer_info?: any;
  seller_info?: SellerInfo;
  created_by?: IDeactivatedBy;
  is_active: 0 | 1;
  deactivated_by: IDeactivatedBy[];
  updated_by: IDeactivatedBy[];
  __v: number;
}

export interface IProductDoc extends Document, IProduct {
  id: string;
  __v: number;
}

export type UpdateProductBody = Partial<IProduct>;

export type NewCreatedProduct = Omit<
  IProduct,
  'is_active' | 'created_by' | 'deactivated_by' | 'updated_by' | '__v'
>;

export interface IProductWithTokens {
  user: IProductDoc;
  tokens: AccessAndRefreshTokens;
}

// export type IProductModel = Model<IProductDoc>;
export interface IProductModel extends PaginateModel<IProductDoc> {
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

export interface ISearchProductRequestParams {
  search: string;
  sort_field: string;
  sort_type: string;
}
