/* eslint-disable import/no-cycle */
import { v4 as uuidv4 } from 'uuid';
import ServiceConfig from '../../setup/validate/config';
import { IRequestClient } from '../interfaces/request-client.interface';

import logger from '../lib/logger';

import RequestClient from './request-adapter';

const scope = `EsAdapter#${1}`;

export default class ESAdapter {
  private _requestClient: IRequestClient;

  public index;

  public url: string;

  constructor(index: string) {
    this.index = index;
    const { config } = new ServiceConfig();
    const elasticSearch = config.service_config.infrastructure.elasticsearch;
    this.url = `${elasticSearch.protocol}://${elasticSearch.host}:${elasticSearch.port}`;
    this._requestClient = new RequestClient(this.url);
  }

  public createDocument = async (body: any) => {
    const method = 'createDocument';
    try {
      const endpoint = `${this.index}/doc/${uuidv4()}`;
      const result = await this._requestClient.put({ endpoint, body });
      return result;
    } catch (ex: unknown) {
      logger.error(scope, method, ex);
    }
  };
}
