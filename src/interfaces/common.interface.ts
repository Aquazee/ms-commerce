export interface IValidations {
  getUserValidation: any;
  registerUserValidation: any;
  updateUserValidation: any;
  forgotPassword: any;
  verifyUser: any;
  getProductValidation: any;
  // updateProductValidation: any;
  // postProductValidation: any;
}

export interface IAddressModel {
  aid: string;
  line_1: string;
  line_2: string;
  landmark: string;
  city: string;
  state: string;
  country: string;
  pin_code: string;
  default: number;
  type: string;
}

export type IHTTPMethods =
  | 'GET'
  | 'PUT'
  | 'POST'
  | 'PATCH'
  | 'DELETE'
  | 'OPTIONS'
  | 'HEAD';

export interface IDeactivatedBy {
  email: string;
  admin_id: string;
  created_date: string;
}
