import { IHTTPMethods } from './common.interface';

export type IContentLength =
  | 'application/x-www-form-urlencoded'
  | 'application/json';

export interface IRequestHeaders extends Headers {
  Authorization?: string;
  Cookie?: string;
  'Content-Type'?: string;
  'Content-Length'?: IContentLength;
  Host?: string;
  'User-Agent'?: string;
  Accept?: string;
  'Accept-Encoding'?: string;
  Connection?: string;
}

export interface IRequestParams {
  cache: 'no-store' | 'reload' | 'no-cache' | 'force-cache' | 'only-if-cached';
  mode: 'same-origin';
  redirect: 'follow' | 'error' | 'manual';
}

export interface IInitConfig {
  url: string;
}

export interface IRequestPost {
  endpoint: string;
  body: {
    [key: string]: any;
  };
}

export interface IRequestClient {
  baseUrl: string;
  header: IRequestHeaders;
  post: (data: IRequestPost) => any;
  put: (data: IRequestPost) => any;
}
