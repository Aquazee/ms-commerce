import request, { Response } from 'request';
import { v4 as uuidv4 } from 'uuid';
import {
  IInitConfig,
  IRequestPost,
  IRequestClient,
  IRequestHeaders,
} from '../interfaces/request-client.interface';
import logger from '../lib/logger';
// eslint-disable-next-line import/no-cycle
import ESAdapter from './es-adapter';

const scope = `RequestClient#${'0.1'}`;

export default class RequestClient<IRequestClient> {
  public baseUrl = '';

  private _esAdapter;

  public header: IRequestHeaders = {
    'Content-Type': 'application/json',
    'User-Agent': 'ms-commerce',
    Connection: 'keep-alive',
  };

  constructor(url: string) {
    this.initConfig({ url });
    this._esAdapter = new ESAdapter('');
  }

  initConfig({ url }: IInitConfig) {
    this.baseUrl = url;
  }

  setHeaders(header?: IRequestHeaders) {
    this.header = Object.assign(this.header, header);
  }

  setAuth(token: string) {
    this.header.append('Authorization', token);
  }

  public post = ({ endpoint, body }: IRequestPost) => {
    new Promise((resolve, reject) => {
      const method = 'post';
      const url = `${this.baseUrl}/${endpoint}`;
      const options = {
        url,
        header: this.header,
        method,
        body: JSON.stringify(body),
      };
      request(options, (error: Error, response: Response) => {
        if (error) {
          this._logError(error);
          reject(error);
        }
        resolve(response.body);
      });
    });
  };

  public put = ({ endpoint, body }: IRequestPost) => {
    new Promise((resolve, reject) => {
      const method = 'PUT';
      const url = `${this.baseUrl}/${endpoint}`;
      const options = {
        url,
        header: this.header,
        method: method || 'PUT',
        body: JSON.stringify(body),
      };
      logger.info(scope, method, JSON.stringify(options));
      request(options, (error: Error, response: Response) => {
        if (error) {
          this._logError(error);
          reject(error);
        }
        resolve(response.body);
      });
    });
  };

  private async _logError(error: Error) {
    const method = '_logError';
    try {
      const logError = {
        scope,
        method,
        error,
      };
      logger.error(JSON.stringify(logError));
      await this._esAdapter.createDocument(logError);
    } catch (ex) {
      logger.error(ex);
    }
  }
}
