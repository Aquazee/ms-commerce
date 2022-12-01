import { Types, Model, Document, PaginateModel } from 'mongoose';
import { IAddressModel, IDeactivatedBy } from './common.interface';

export interface IOrder {
  id?: string;
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

export interface IOrderDoc extends Document, IOrder {
  id: string;
  isPasswordMatch(password: string): Promise<boolean>;
  __v: number;
}

export interface IOrderModel extends PaginateModel<IOrderDoc> {
  isEmailTaken(
    email: string,
    excludeOrderId?: Types.ObjectId
  ): Promise<boolean>;
  isPasswordMatch(password: string): Promise<boolean>;
}

export type UpdateOrderBody = Partial<IOrder>;

export type NewRegisteredOrder = Omit<
  IOrder,
  | 'is_active'
  | 'is_blocked'
  | 'created_by'
  | 'deactivated_by'
  | 'updated_by'
  | '__v'
>;

export type NewCreatedOrder = Omit<
  IOrder,
  | 'is_active'
  | 'is_blocked'
  | 'created_by'
  | 'deactivated_by'
  | 'updated_by'
  | '__v'
>;

export interface IOrderInterface {
  orderValidation: any;
}

export interface IGetOrderRequest {
  orderId?: string;
}

export interface IOrderService {
  // constructor: () => void;
  createOrder: (orderBody: NewCreatedOrder) => Promise<IOrderDoc>;
  updateOrderById: (
    orderId: string,
    updateBody: UpdateOrderBody
  ) => Promise<IOrderDoc | null>;
  getOrderById: (id: string) => Promise<IOrderDoc | null>;
}
