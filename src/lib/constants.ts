import { IEmailTypeDetails } from '../interfaces/mail.interface';

export const MailServer = {
  gmail: 'gmail',
  ses: 'ses',
};

export const Environment = {
  production: 'production',
  test: 'test',
  local: 'local',
};

export const LoginType = {
  facebook: 'facebook',
  email: 'email',
  google: 'google',
};

export const EmailTypeDetails: IEmailTypeDetails = {
  UserEmailVerification: {
    name: 'UserEmailVerification',
    subject: 'Email Account Verification',
    templatePath: '/src/mail-templates/email-confirmation.html',
  },
  ForgotPassword: {
    name: 'ForgotPassword',
    subject: 'Forgot Password - Verification Link',
    templatePath: '../mail-templates/forgot-password.html',
  },
  UserMobileVerification: {
    name: 'UserMobileVerification',
    subject: 'Mobile Number Verification',
    templatePath: '../mail-templates/forgot-password.html',
  },
};

export const EmailTypeDetailsKeys = {
  UserEmailVerification: 'UserEmailVerification',
  ForgotPassword: 'ForgotPassword',
  UserMobileVerification: 'UserMobileVerification',
};
