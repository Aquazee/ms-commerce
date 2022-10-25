export interface Auth {
  user: string;
  pass: string;
}

export interface ThirdPartyLoginCredentials {
  client_id: string;
  client_secret: string;
  callback_url: string;
}
export interface Login {
  facebook: ThirdPartyLoginCredentials;
  google: ThirdPartyLoginCredentials;
}
export interface ICommonConfig {
  host: string;
  port: number;
  auth: Auth;
}

type IMailServer = 'gmail' | 'ses';

export interface IEmailServiceType {
  gmail: ICommonConfig;
  ses: ICommonConfig;
}

export interface SMTP {
  enabled: IMailServer;
  type: IEmailServiceType;
}

export interface ThirdParty {
  smtp: SMTP;
  login: Login;
}

interface IDBConfig extends ICommonConfig {
  name: string;
}
export interface Database {
  enabled: string;
  mongodb: IDBConfig;
}

export interface AllErrors {
  index: string;
  type: string;
}

export interface ICookieConfig {
  secret: string;
  resave: boolean;
  saveUninitialized: boolean;
}

export interface IJwtConfig {
  expiry_mins: number;
  secret: string;
}

export interface ICryptoConfig {
  secret: string;
}

export interface Server {
  public_port: number;
  private_port: number;
  protocol: 'http' | 'https';
  host: string;
  root_path: string;
  cookie_config: ICookieConfig;
  crypto_config: ICryptoConfig;
  jwt_config: IJwtConfig;
  allowed_login_attempt: number;
  block_hours: number;
  email_verification_max_days: number;
}

export interface ErrorIndexes {
  all_errors: AllErrors;
}

export interface Elasticsearch {
  protocol: string;
  host: string;
  port: number;
  error_indexes: ErrorIndexes;
}

export interface IQueueServiceConfigAuth {
  user: string;
  pass: string;
}

export interface IQueueServiceConfig {
  host: string;
  port: number;
  channel: string;
  auth: IQueueServiceConfigAuth;
}

export interface IQueueService {
  enabled: 'amqp';
  amqp: IQueueServiceConfig;
}

export interface Infrastructure {
  database: Database;
  elasticsearch: Elasticsearch;
  queue_service: IQueueService;
}

export interface ServiceConfig {
  environment: string;
  server: Server;
  infrastructure: Infrastructure;
  third_party: ThirdParty;
}

export interface IServiceConfig {
  service_config: ServiceConfig;
}
