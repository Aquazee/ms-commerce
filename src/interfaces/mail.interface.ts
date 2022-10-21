export interface IMailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export interface IEmailTypeDetailsDetails {
  name: string;
  subject: string;
  templatePath: string;
}

export interface IEmailTypeDetails {
  UserEmailVerification: IEmailTypeDetailsDetails;
  ForgotPassword: IEmailTypeDetailsDetails;
  UserMobileVerification: IEmailTypeDetailsDetails;
}

export interface IUserMailBaseData {
  event: string;
  body: {
    [key: string]: any;
  };
}

export interface IUserMailData extends IUserMailBaseData {
  subject: string;
  host: 'http' | 'https';
  protocol: string;
  port: number;
}

export interface IBaseEmailData {
  body: {
    [key: string]: any;
  };
}
