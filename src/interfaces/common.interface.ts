export interface IValidations {
  getUserValidation: any;
  registerUserValidation: any;
  updateUserValidation: any;
}

export interface IAddressModel {
  line_1: string;
  line_2: string;
  city: string;
  country: string;
  postal_code: string;
}

export type IHTTPMethods =
  | 'GET'
  | 'PUT'
  | 'POST'
  | 'PATCH'
  | 'DELETE'
  | 'OPTIONS'
  | 'HEAD';
