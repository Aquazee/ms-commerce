import path from 'path';
import { token } from 'morgan';
import nodemailer, { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import nunjucks from 'nunjucks';

import ServiceConfig from '../../setup/validate/config';
import {
  IServiceConfig,
  ICommonConfig,
} from '../../setup/validate/config.interface';
import ApiError from '../abstractions/ApiError';
import BaseApi from '../components/BaseApi';
import {
  IMailOptions,
  IUserMailBaseData,
  IUserMailData,
} from '../interfaces/mail.interface';
import { EmailTypeDetails, MailServer } from '../lib/constants';
import logger from '../lib/logger';
import Messages from '../lib/messages';

const scope = `MailAdapter#${1.0}`;

interface IMailAdapter {
  sendEmail: (userMailData: IUserMailData) => void;
}

export default class MailAdapter extends BaseApi {
  private _transport: Transporter<SMTPTransport.SentMessageInfo>;

  constructor() {
    super();
    this.init();
  }

  async init() {
    const method = 'init';
    try {
      this._transport = nodemailer.createTransport(this.getConfig());
      await this._transport.verify();
      logger.info(scope, method, Messages.EmailServerConnected);
    } catch (ex) {
      logger.error(scope, method, Messages.EmailServeConnectionFailed, ex);
      throw ex;
    }
  }

  getConfig() {
    const method = 'getConfig';
    const { enabled, type } = this.config.third_party.smtp;
    switch (enabled) {
      case MailServer.ses:
        return this._getSesConfig(type.ses);
      case MailServer.gmail:
      default:
        return this._getGmailConfig(type.gmail);
    }
  }

  _getSesConfig(sesConfig: ICommonConfig) {
    const method = 'getConfig';
    logger.info(scope, method, Messages.MethodNotImplemented);
    return sesConfig;
  }

  _getGmailConfig(gmailConfig: ICommonConfig) {
    return {
      host: gmailConfig.host,
      port: gmailConfig.port,
      secure: true, // true for 465, false for other ports
      ignoreTLS: true,
      auth: {
        user: gmailConfig.auth.user,
        pass: gmailConfig.auth.pass,
      },
    };
  }

  renderTemplates = async ({
    templatePath,
    userMailData,
  }: {
    templatePath: string;
    userMailData: IUserMailBaseData;
  }) => {
    const { server } = this.config;
    const method = 'renderTemplates';

    if (templatePath) {
      nunjucks.configure({ autoescape: true });
      return nunjucks.render(templatePath, {
        ...userMailData.body,
        ...{
          domain: `${server.protocol}://${server.host}:${server.public_port}`,
          url: 'www.proflyl.com',
          company_name: 'Proflyl',
        },
      });
    }
    const error = new ApiError(Messages.EmailTemplateNotFound);
    logger.error(scope, method, error);
    throw error;
  };

  getEmailDetails = (event: string) => {
    switch (event) {
      case EmailTypeDetails.UserEmailVerification.name:
        return EmailTypeDetails.UserEmailVerification;
      case EmailTypeDetails.UserMobileVerification.name:
        return EmailTypeDetails.UserMobileVerification;
      case EmailTypeDetails.ForgotPassword.name:
        return EmailTypeDetails.ForgotPassword;

      default:
        throw Messages.EmailTemplateNotFound;
    }
  };

  public sendEmail = async (userMailData: IUserMailBaseData) => {
    const method = 'sendEmail';
    const me = this;
    try {
      const emailDetails = this.getEmailDetails(userMailData.event);
      const templatePath = path.resolve(
        me.config.server.root_path + emailDetails.templatePath
      );
      const mailOption: IMailOptions = {
        to: userMailData.body.email,
        subject: emailDetails.subject,
        html: await this.renderTemplates({
          templatePath,
          userMailData,
        }),
      };
      await this._sendEmail(mailOption);
    } catch (ex) {
      logger.error(scope, method, Messages.SendEmailFailure, ex);
      throw ex;
    }
  };

  private _sendEmail = async (mailOption: IMailOptions) => {
    const method = 'sendEmail';
    try {
      const result = await this._transport.sendMail(mailOption);
      logger.info(scope, method, Messages.SendEmailSuccess);
    } catch (ex) {
      logger.error(scope, method, Messages.SendEmailFailure, ex);
      throw ex;
    }
  };

  register() {
    throw new Error('Method not implemented.');
  }
}
